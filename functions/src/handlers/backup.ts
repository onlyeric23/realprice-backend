import { backupPrice as backupPriceCore } from '../core/backup';
import firebaseRequestHandler from '../core/index.js';

export const backupPrice = firebaseRequestHandler(async (_, response) => {
  await backupPriceCore((__, message) => {
    response.status(200).send(message);
  });
});
