import map from '@google/maps';

import { GOOGLE_MAPS_API_KEY } from '../config.json';

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

export const flatternGeocodingResult: (
  result: map.GeocodingResult
) => { formatted_address: string; lat: number; lng: number } = result => {
  return {
    formatted_address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
};
