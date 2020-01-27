import { firebaseRequestHandler } from '../core';
import { backupPrice as backupPriceCore } from '../core/backup';

export const backupPrice = firebaseRequestHandler(async (_, response) => {
  await backupPriceCore((__, message) => {
    response.status(200).send(message);
  });
});
