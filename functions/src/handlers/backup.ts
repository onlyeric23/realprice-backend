import firebaseRequestHandler from "../core/index.js";
import { backupPrice, BackupResult } from "../core/backup";

export default firebaseRequestHandler(async (_, response) => {
  await backupPrice((__, message) => {
    response.status(200).send(message);
  });
});
