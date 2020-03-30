import { Op } from 'sequelize';
import { firebaseRequestHandler } from '../core';
import { geocodeAddress } from '../core/geo';
import { RawLocation } from '../models/RawLocation';

export const geocodeItem = firebaseRequestHandler(async (req, res) => {
  const locations = await RawLocation.findAll({
    where: {
      geocodedAt: {
        [Op.eq]: null,
      },
    },
    limit: 10,
  });
  await Promise.all(locations.map(geocodeAddress));
  res.sendStatus(200).end();
});
