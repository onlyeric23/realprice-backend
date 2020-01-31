import map from '@google/maps';

import { GOOGLE_MAPS_API_KEY } from '../config.json';
import { firebaseRequestHandler } from '../core';

const _geocode: (
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
      if (results.length > 1) {
        throw new Error('More than one result');
      } else if (results.length === 1) {
        return results[0];
      }
      return null;
    });
};

const flatternGeocodingResult: (
  result: map.GeocodingResult
) => { formatted_address: string; lat: number; lng: number } = result => {
  return {
    formatted_address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
};

export const geocode = firebaseRequestHandler(async (req, res) => {
  const { address } = req.body;
  const geocoded = await _geocode(address);
  if (geocoded) {
    res.send(flatternGeocodingResult(geocoded)).end();
  } else {
    res.sendStatus(404).end();
  }
});
