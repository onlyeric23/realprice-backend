import map from '@google/maps';
import { Sequelize } from 'sequelize';

import { GOOGLE_MAPS_API_KEY } from '../../config/config';
import { Geo } from '../models/Geo';
import { RawLocation } from '../models/RawLocation';
import { ADDRESS_TAIWAN } from './regex';
import { contain } from './utils';

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
      language: 'zh-TW',
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
  };
};

const checkValid = (address: string, geocodeResult: map.GeocodingResult) => {
  const addressMatched = address.match(ADDRESS_TAIWAN);
  const geocodedMatched = geocodeResult.formatted_address.match(ADDRESS_TAIWAN);

  if (!addressMatched || !geocodedMatched) {
    return false;
  }

  const geocodedFragments = new Set(
    geocodedMatched.slice(1).filter(e => e != null)
  );
  const addressFragments = new Set(
    addressMatched.slice(1).filter(e => e != null)
  );

  if (
    contain(geocodedFragments, addressFragments) ||
    contain(addressFragments, geocodedFragments)
  ) {
    return true;
  }
  console.warn('Invalid deteced', addressFragments, geocodedFragments);
  return false;
};

export const geocodeAddress = async (rawLocation: RawLocation) => {
  let geoId = null;
  const geocodedAt = Sequelize.literal('CURRENT_TIMESTAMP');

  const geocoded = await geocode(rawLocation.location);
  if (geocoded) {
    if (checkValid(rawLocation.location, geocoded)) {
      const [geo] = await Geo.bulkCreate([flatternGeocodingResult(geocoded)], {
        ignoreDuplicates: true,
      });
      geoId = geo.id;
    }
  }
  await rawLocation.update({
    geoId,
    geocodedAt,
  });
};
