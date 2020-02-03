import { firebaseRequestHandler } from '../core';
import { flatternGeocodingResult, geocode as geocodeCore } from '../core/geo';

export const geocode = firebaseRequestHandler(async (req, res) => {
  const { address } = req.body;
  const geocoded = await geocodeCore(address);
  if (geocoded) {
    res.send(flatternGeocodingResult(geocoded)).end();
  } else {
    res.sendStatus(404).end();
  }
});
