import { firebaseRequestHandler } from '../core';
import { backupPrice as backupPriceCore } from '../core/storage';

export const backupPrice = firebaseRequestHandler(async (_, response) => {
  await backupPriceCore((__, message, status = 200) => {
    response
      .status(status)
      .send(message)
      .end();
  });
});
