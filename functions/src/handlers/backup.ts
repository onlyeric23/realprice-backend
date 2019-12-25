import firebaseRequestHandler from "../core/index.js";
import { backupPrice, BackupResult } from "../core/backup";

export default firebaseRequestHandler(async (_, response) => {
  await backupPrice((result, name) => {
    if (result === BackupResult.ALREADY_EXIST) {
      response.status(200).send("Already up-to-date.");
    } else if (result === BackupResult.BACKUP_NEW_FILE) {
      response.status(200).send(`Backup new file ${name}`);
    }
  });
});
