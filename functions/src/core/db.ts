import admin from 'firebase-admin';
import { Writable } from 'stream';

import { DB_COLLECTION_REAL_PRICE } from './constant';
import {
  fetchLatestStoredRealPrice,
  fetchRealPriceFile,
  getRealPriceBucketPrefix,
} from './storage';
import { generateChecksum } from './utils.js';

export enum BackupResult {
  ALREADY_EXIST,
  BACKUP_NEW_FILE,
}

const writeStreamProm = (chunk: any, stream: Writable) =>
  new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(chunk, resolve);
  });

export const backupPrice = async (
  onSuccess?: (result: BackupResult, message: string) => void
) => {
  // Fetch the latest stored file and the current file.
  const [price, latestStoredPrice] = await Promise.all([
    fetchRealPriceFile(),
    fetchLatestStoredRealPrice(),
  ]);
  const currentChecksum = generateChecksum(price!);
  const latestChecksum = latestStoredPrice
    ? generateChecksum(latestStoredPrice)
    : null;

  // Compare the latest stored file and the current file.
  // If they are the same, it is already up-to-date.
  // Otherwise, store the current file to Storage.
  if (currentChecksum === latestChecksum) {
    const message = 'Already up-to-date.';
    console.info(message);
    if (onSuccess) {
      onSuccess(BackupResult.ALREADY_EXIST, message);
    }
  } else {
    const backupName = getRealPriceBucketPrefix(new Date());
    const bucket = admin.storage().bucket();
    const file = bucket.file(backupName);
    const stream = file.createWriteStream();
    await writeStreamProm(price, stream)
      .then(() =>
        file.setMetadata({
          contentType: 'text/xml',
        })
      )
      .catch(error => {
        console.warn(error);
        return file.delete();
      });
    const message = `Backup new file ${backupName}`;
    console.info(message);
    if (onSuccess) {
      onSuccess(BackupResult.BACKUP_NEW_FILE, message);
    }
  }
};

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
