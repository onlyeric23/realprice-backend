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

export const geocodeAddress = async (rawLocation: RawLocation) => {
  const geocoded = await geocode(rawLocation.location);
  if (geocoded) {
    const geo = await Geo.create(flatternGeocodingResult(geocoded));
    await rawLocation.update({
      geoId: geo.id,
      isValid: true,
      geocodedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  }
};
