import { firebaseScheduler } from '../core';
import { backupPrice } from '../core/storage';
import { transformPrice } from '../core/transform';

export const backupPriceSchedule = firebaseScheduler(async () => {
  await backupPrice();
  await transformPrice();
}, '0 1 * * *');
