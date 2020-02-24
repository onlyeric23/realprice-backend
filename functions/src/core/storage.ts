import admin, { firestore } from 'firebase-admin';
import { Readable, Writable } from 'stream';
import {
  GOV_REAL_PRICE_DATA,
  RESOURCE_REAL_PRICE_EXT,
  RESOURCE_REAL_PRICE_PREFIX,
  STORAGE_RESOURCES,
} from '../core/constant';
import { ISO8601 } from '../core/regex';

import https from 'https';
import { readableToString, generateChecksum } from './utils';

export const fetchRealPriceFile = () => {
  return new Promise<Readable>(resolve => {
    https.get(GOV_REAL_PRICE_DATA, resolve);
  }).then(readableToString);
};

export const getRealPriceFilename = (
  date: Date | string | firestore.Timestamp
) => {
  let dateString = date;
  if (date instanceof Date) {
    dateString = date.toISOString();
  } else if (date instanceof firestore.Timestamp) {
    dateString = date.toDate().toISOString();
  }
  return `${RESOURCE_REAL_PRICE_PREFIX}_${dateString}.${RESOURCE_REAL_PRICE_EXT}`;
};

export const getRealPriceBucketPrefix = (date: Date) =>
  `${STORAGE_RESOURCES}/${getRealPriceFilename(date)}`;

export const fetchStoredRealPriceDates = () => {
  const bucket = admin.storage().bucket();
  const matchPattern = new RegExp(
    `^${STORAGE_RESOURCES}/` +
      RESOURCE_REAL_PRICE_PREFIX +
      '_(' +
      ISO8601.source +
      ')\\.' +
      RESOURCE_REAL_PRICE_EXT +
      '$'
  );
  return bucket
    .getFiles({
      prefix: `${STORAGE_RESOURCES}/${RESOURCE_REAL_PRICE_PREFIX}`,
    })
    .then(([files]) => files)
    .then(files => {
      if (files.length === 0) {
        return [];
      }
      return files
        .map(file => {
          const matched = file.name.match(matchPattern);
          return matched as string[];
        })
        .filter(result => !!result)
        .map(matched => matched[1]);
    });
};

export const fetchStoredRealPriceByDate = (date: Date | string) => {
  const bucket = admin.storage().bucket();
  return bucket
    .getFiles({
      prefix: getRealPriceBucketPrefix(new Date(date)),
    })
    .then(([files]) => files[0])
    .then(file => file.download())
    .then(([contents]) => contents);
};

export const fetchLatestStoredRealPriceDate = () => {
  return fetchStoredRealPriceDates().then(dates =>
    dates.reduce((max, curr) => (curr > max ? curr : max), '')
  );
};

export const fetchLatestStoredRealPrice = () => {
  return fetchLatestStoredRealPriceDate().then(date => {
    return date ? fetchStoredRealPriceByDate(date) : null;
  });
};

const writeStreamProm = (chunk: any, stream: Writable) =>
  new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(chunk, resolve);
  });

export enum BackupResult {
  ALREADY_EXIST,
  BACKUP_NEW_FILE,
}

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
