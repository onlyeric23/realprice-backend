import { Op } from 'sequelize';

import { firebaseScheduler } from '../core';
import { geocodeAddress } from '../core/geo';
import { RawLocation } from '../models/RawLocation';

const CRONTAB = '0,30 * * * *';

const scheduler = async () => {
  const rawLocations = await RawLocation.findAll({
    where: {
      geocodedAt: {
        [Op.eq]: null,
      },
    },
    limit: 25,
  });
  await rawLocations.map(geocodeAddress);
};

export const geocodingSchedule = firebaseScheduler(scheduler, CRONTAB);
