import { backupPrice } from "../core/backup";
import { firebaseScheduler } from "../core";

const scheduledBackupPrice = firebaseScheduler(async () => {
  await backupPrice();
}, "0 1 * * *");

export default scheduledBackupPrice;
