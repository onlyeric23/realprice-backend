import { backupPrice } from "../core/backup";
import { firebaseScheduler } from "../core";

export const backupPriceSchedule = firebaseScheduler(async () => {
  await backupPrice();
}, "0 1 * * *");
