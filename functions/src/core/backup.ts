import admin from 'firebase-admin';
import https from 'https';
import { Readable, Writable } from 'stream';
import { GOV_REAL_PRICE_DATA } from '../config';
import {
  fetchStoredRealPriceByDate,
  fetchStoredRealPriceDates,
  getRealPriceBucketPrefix,
} from '../core/storage';
import { generateChecksum } from '../core/utils.js';
import { readableToString } from './utils';

const fetchRealPrice = () => {
  return new Promise<Readable>(resolve => {
    https.get(GOV_REAL_PRICE_DATA, resolve);
  }).then(readableToString);
};

const fetchLatestStoredRealPriceDate = () => {
  return fetchStoredRealPriceDates().then(dates =>
    dates.reduce((max, curr) => (curr > max ? curr : max), '')
  );
};

const fetchLatestStoredRealPrice = () => {
  return fetchLatestStoredRealPriceDate().then(date => {
    console.debug('date', date);
    return date ? fetchStoredRealPriceByDate(date) : null;
  });
};

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
  const [price, latestStoredPrice] = await Promise.all([
    fetchRealPrice(),
    fetchLatestStoredRealPrice(),
  ]);
  const currentChecksum = generateChecksum(price!);
  const latestChecksum = latestStoredPrice
    ? generateChecksum(latestStoredPrice)
    : null;

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
    await writeStreamProm(price, stream).then(() =>
      file.setMetadata({
        contentType: 'text/xml',
      })
    );
    const message = `Backup new file ${backupName}`;
    console.info(message);
    if (onSuccess) {
      onSuccess(BackupResult.BACKUP_NEW_FILE, message);
    }
  }
};
