import { firebaseRequestHandler } from '../core';
import { transformPrice as transformPriceCore } from '../core/transform';

export const transformPrice = firebaseRequestHandler(async (_, response) => {
  await transformPriceCore((__, message) => {
    response
      .status(200)
      .send(message)
      .end();
  });
});
