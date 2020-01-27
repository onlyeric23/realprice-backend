import { firebaseScheduler } from '../core';
import { backupPrice } from '../core/backup';

export const backupPriceSchedule = firebaseScheduler(async () => {
  await backupPrice();
}, '0 1 * * *');
