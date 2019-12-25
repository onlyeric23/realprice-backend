import * as functions from "firebase-functions";
import { backupPrice } from "../core/backup";

const scheduledBackupPrice = functions.pubsub
  .schedule("0 1 * * *")
  .timeZone("Asia/Taipei")
  .onRun(async () => {
    await backupPrice();
    return null;
  });

export default scheduledBackupPrice;
