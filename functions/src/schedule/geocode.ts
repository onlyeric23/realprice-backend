import { firebaseScheduler } from '../core';
import {
  DB_COLLECTION_ITEMS,
  MAPS_GEOCODNG_REQUEST_LIMIT_PER_MONTH,
} from '../core/constant';
import { getRealPriceDocRef } from '../core/db';
import { flatternGeocodingResult, geocode } from '../core/geo';

const CRONTAB = '30 * * * *';

// This scheduler find every RealPrice items without latitude and longtitude, then request geocode from Google Maps API.
const scheduler = async () => {
  const MAX_REQUEST_COUNT_PER_30_MIN = Math.floor(
    MAPS_GEOCODNG_REQUEST_LIMIT_PER_MONTH / 31 / 24 / 2
  );
  const itemSnaps = await getRealPriceDocRef().then(docRef =>
    docRef
      ?.collection(DB_COLLECTION_ITEMS)
      .where('lat', '==', null)
      .where('lng', '==', null)
      .where('formatted_address', '==', null)
      .where('geocoded', '==', false)
      .limit(MAX_REQUEST_COUNT_PER_30_MIN)
      .get()
      .then(snap => snap.docs)
  );
  if (itemSnaps && itemSnaps.length > 0) {
    await Promise.all(
      itemSnaps.map(async snap => {
        const { LOCATION, DISTRICT } = snap.data();
        return geocode(`台北市 ${DISTRICT} ${LOCATION}`).then(result => {
          let updateData = {
            geocoded: true,
          };
          if (result) {
            updateData = {
              ...updateData,
              ...flatternGeocodingResult(result),
            };
          }
          snap.ref.update(updateData);
        });
      })
    );
  }
};

export const geocodingSchedule = firebaseScheduler(scheduler, CRONTAB);
