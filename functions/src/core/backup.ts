import https from "https";
import { Readable } from "stream";
import admin from "firebase-admin";
import { GOV_REAL_PRICE_DATA } from "../config";
import { readableToString } from "./utils";
import { generateChecksum } from "../core/utils.js";
import {
  getRealPriceBucketPrefix,
  fetchStoredRealPriceDates,
  fetchStoredRealPriceByDate
} from "../core/storage";

const fetchRealPrice = () => {
  return new Promise<Readable>(resolve => {
    https.get(GOV_REAL_PRICE_DATA, resolve);
  }).then(readableToString);
};

const fetchLatestStoredRealPriceDate = () => {
  return fetchStoredRealPriceDates().then(dates =>
    dates.reduce((max, curr) => (curr > max ? curr : max), "")
  );
};

const fetchLatestStoredRealPrice = () => {
  return fetchLatestStoredRealPriceDate().then(fetchStoredRealPriceByDate);
};

export enum BackupResult {
  ALREADY_EXIST,
  BACKUP_NEW_FILE
}

export const backupPrice = async (
  onSuccess?: (result: BackupResult, message: string) => void
) => {
  const [price, latestStoredPrice] = await Promise.all([
    fetchRealPrice(),
    fetchLatestStoredRealPrice()
  ]);
  const currentChecksum = generateChecksum(price);
  const latestChecksum = generateChecksum(latestStoredPrice);

  if (currentChecksum === latestChecksum) {
    const message = "Already up-to-date.";
    console.info(message);
    if (onSuccess) {
      onSuccess(BackupResult.ALREADY_EXIST, message);
    }
  } else {
    const backupName = getRealPriceBucketPrefix(new Date());
    const bucket = admin.storage().bucket();
    const stream = bucket.file(backupName).createWriteStream();
    stream.write(price);
    stream.end();
    if (onSuccess) {
      const message = `Backup new file ${backupName}`;
      onSuccess(BackupResult.BACKUP_NEW_FILE, message);
    }
  }
};
