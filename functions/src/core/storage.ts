import admin from "firebase-admin";
import {
  STORAGE_RESOURCES,
  RESOURCE_REAL_PRICE_PREFIX,
  RESOURCE_REAL_PRICE_EXT
} from "../config";
import { ISO8601 } from "../core/regex";

export const getRealPriceBucketPrefix = (date: Date) =>
  `${STORAGE_RESOURCES}/${RESOURCE_REAL_PRICE_PREFIX}_${date.toISOString()}.${RESOURCE_REAL_PRICE_EXT}`;

export const fetchStoredRealPriceDates = () => {
  const bucket = admin.storage().bucket();
  const matchPattern = new RegExp(
    `^${STORAGE_RESOURCES}/` +
      RESOURCE_REAL_PRICE_PREFIX +
      "_(" +
      ISO8601.source +
      ")\\." +
      RESOURCE_REAL_PRICE_EXT +
      "$"
  );
  return bucket
    .getFiles({
      prefix: `${STORAGE_RESOURCES}/${RESOURCE_REAL_PRICE_PREFIX}`
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
      prefix: getRealPriceBucketPrefix(new Date(date))
    })
    .then(([files]) => files[0])
    .then(file => file.download())
    .then(([contents]) => contents);
};
