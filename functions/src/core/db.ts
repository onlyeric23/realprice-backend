import admin from 'firebase-admin';

import { DB_COLLECTION_REAL_PRICE } from './constant';

// Get RealPrice according to the options.
// If no options are specified, It will return the latest doc according to doc.date.
export const getRealPriceDocRef = async (options?: { dateBefore?: string }) => {
  const db = admin.firestore();
  const docSnaps = await db
    .collection(DB_COLLECTION_REAL_PRICE)
    .get()
    .then(snap => snap.docs);
  let latestDocSnap;
  let latestDate;
  for (const docSnap of docSnaps) {
    const date: string = await docSnap.get('date');
    if (options?.dateBefore && date > options?.dateBefore) {
      continue;
    }
    if (!latestDocSnap) {
      latestDocSnap = docSnap;
      latestDate = await docSnap.get('date');
    } else {
      if (date > latestDate) {
        latestDocSnap = docSnap;
        latestDate = await docSnap.get('date');
      }
    }
  }
  return latestDocSnap?.ref;
};

export type FIELD_TYPE = null | string | number;

export const stringToField: (raw: string) => FIELD_TYPE = raw => {
  if (!raw) {
    return null;
  }
  const num = Number(raw);
  if (Number.isNaN(num)) {
    return raw;
  }
  return num;
};
