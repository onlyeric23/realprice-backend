import admin from 'firebase-admin';
import { Readable } from 'stream';
import {
  GOV_REAL_PRICE_DATA,
  RESOURCE_REAL_PRICE_EXT,
  RESOURCE_REAL_PRICE_PREFIX,
  STORAGE_RESOURCES,
} from '../core/constant';
import { ISO8601 } from '../core/regex';

import https from 'https';
import { readableToString } from './utils';

export const fetchRealPriceFile = () => {
  return new Promise<Readable>(resolve => {
    https.get(GOV_REAL_PRICE_DATA, resolve);
  }).then(readableToString);
};

export const getRealPriceFilename = (date: Date | string) => {
  if (date instanceof Date) {
    return `${RESOURCE_REAL_PRICE_PREFIX}_${date.toISOString()}.${RESOURCE_REAL_PRICE_EXT}`;
  }
  return `${RESOURCE_REAL_PRICE_PREFIX}_${date}.${RESOURCE_REAL_PRICE_EXT}`;
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
