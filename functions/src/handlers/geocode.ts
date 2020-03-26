import { Op } from 'sequelize';
import { firebaseRequestHandler } from '../core';
import { geocodeAddress } from '../core/geo';
import { RawLocation } from '../models/RawLocation';

export const geocodeItem = firebaseRequestHandler(async (req, res) => {
  const location = await RawLocation.findOne({
    where: {
      geocodedAt: {
        [Op.eq]: null,
      },
    },
  });
  if (location) {
    await geocodeAddress(location);
  }
  res.sendStatus(200).end();
});
