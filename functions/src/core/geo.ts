import map from '@google/maps';

import { Sequelize } from 'sequelize';
import { GOOGLE_MAPS_API_KEY } from '../../config/config';
import { Geo } from '../models/Geo';
import { LocationAssociation } from '../models/LocationAssociation';
import { RawItemTP } from '../models/RawItemTP';
import { RawLocation } from '../models/RawLocation';
import { extendAddress } from './utils';

export const geocode: (
  address: string
) => Promise<map.GeocodingResult | null> = address => {
  const client = map.createClient({
    key: GOOGLE_MAPS_API_KEY,
    Promise,
  });

  return client
    .geocode({
      address,
    })
    .asPromise()
    .then(res => {
      const results = res.json.results;
      if (results.length === 1) {
        return results[0];
      }
      return null;
    });
};

export const flatternGeocodingResult = (result: map.GeocodingResult) => {
  return {
    formattedAddress: result.formatted_address,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    placeId: result.place_id,
  };
};

export const geocodeRawItemTP = async (item: RawItemTP) => {
  await Promise.all(
    extendAddress(item.LOCATION).map(async location => {
      const isExists = Boolean(
        await RawLocation.findOne({
          where: {
            location,
          },
        })
      );
      if (!isExists) {
        const geocoded = await geocode(location);
        if (geocoded) {
          const geo = await Geo.create(flatternGeocodingResult(geocoded));
          const rawLocation = await RawLocation.create({
            location,
            geoId: geo.id,
          });
          await LocationAssociation.create({
            rawItemTPId: item.id,
            locationId: rawLocation.id,
          });
        }
      }
    })
  );

  const updatedItem = (await RawItemTP.findOne({
    where: {
      id: item.id,
    },
    include: [RawLocation],
  }))!;

  if (
    updatedItem.locations.length === extendAddress(item.LOCATION).length
  ) {
    await item.update({
      geocodedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  }
};
