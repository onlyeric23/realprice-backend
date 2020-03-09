import { Op } from 'sequelize';
import { firebaseRequestHandler } from '../core';
import { geocodeRawItemTP } from '../core/geo';
import { RawItemTP } from '../models/RawItemTP';

export const geocodeItem = firebaseRequestHandler(async (req, res) => {
  const item = await RawItemTP.findOne({
    where: {
      geocodedAt: {
        [Op.eq]: null,
      },
    },
  });
  if (item) {
    await geocodeRawItemTP(item);
  }
  res.sendStatus(200).end();
});
