import { firebaseRequestHandler } from '../core';
import { fetchStoredRealPrices } from '../core/storage';
import { transformBufferedFile } from '../core/transform';

export const checkWeirdCastT = firebaseRequestHandler(async (_, response) => {
  const files = await fetchStoredRealPrices();
  const transformed = (
    await Promise.all(files.map(transformBufferedFile))
  ).flat();
  const validCaseTs = new Set(['租賃', '買賣', '預售屋']);
  const invalids = transformed.filter(t => !validCaseTs.has(t.CASE_T));
  response
    .send(invalids)
    .status(200)
    .end();
});
