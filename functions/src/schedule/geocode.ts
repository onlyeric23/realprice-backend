import { firebaseScheduler } from '../core';

import { Op } from 'sequelize';
import { geocodeRawItemTP } from '../core/geo';
import { RawItemTP } from '../models/RawItemTP';

const CRONTAB = '30 * * * *';

const scheduler = async () => {
  const items = await RawItemTP.findAll({
    where: {
      geocodedAt: {
        [Op.eq]: null,
      },
    },
    limit: 2,
  });
  await items.map(geocodeRawItemTP);
};

export const geocodingSchedule = firebaseScheduler(scheduler, CRONTAB);
