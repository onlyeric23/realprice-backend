import { backupPrice } from "../core/backup";
import { firebaseScheduler } from "../core";

export const BackupPriceSchedule = firebaseScheduler(async () => {
  await backupPrice();
}, "0 1 * * *");
