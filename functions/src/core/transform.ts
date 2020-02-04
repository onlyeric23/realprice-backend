import admin from 'firebase-admin';
import get from 'lodash/get';
import { inspect } from 'util';
import { parseStringPromise } from 'xml2js';
import {
  DB_COLLECTION_ITEMS,
  DB_COLLECTION_REAL_PRICE,
  FIRESTORE_BATCH_WRITE_MAX,
} from '../core/constant';
import { getRealPriceDocRef, stringToField } from '../core/db';

import { IRealPriceItem } from '../core/interface.js';
import { ADDRESS_TP } from '../core/regex.js';
import {
  fetchLatestStoredRealPriceDate,
  fetchStoredRealPriceByDate,
  getRealPriceFilename,
} from '../core/storage.js';

export enum TransformResult {
  ALREADY_EXIST,
  TRANSFORM_NEW_FILE,
}

const fetchPriceDocData = async () => {
  const db = admin.firestore();
  return db
    .collection(DB_COLLECTION_REAL_PRICE)
    .get()
    .then(snap => snap.docs.map(doc => doc.data()));
};

const getUntransformedDates = (
  prices: FirebaseFirestore.DocumentData[],
  dates: string[]
) => {
  const priceDateSet = new Set(prices.map(price => price.date));
  return dates.reduce((accu, date) => {
    return priceDateSet.has(date) ? accu : [...accu, date];
  }, [] as string[]);
};

const stripRealPriceToRows = (parsedRealPrice: any) => {
  return get(parsedRealPrice, [
    'soap:Envelope',
    'soap:Body',
    0,
    'RPWeekDataResponse',
    0,
    'RPWeekDataResult',
    0,
    'Rows',
    0,
    'Row',
  ]);
};

const expandRawByLocation = (raw: IRealPriceItem) => {
  const matched = raw.LOCATION.match(ADDRESS_TP);
  if (!matched) {
    throw Error(`Location not matched: ${inspect(raw)}`);
  }
  const [_, range, from, to] = matched;
  if (!range || !from || !to) {
    throw Error(`Location not matched: ${inspect(raw)}`);
  }
  return Array(parseInt(to) - parseInt(from) + 1)
    .fill(0)
    .map((__, index) => ({
      ...raw,
      LOCATION: raw.LOCATION.replace(range, String(parseInt(to) + index)),
    }));
};

const transformByDate = async (date: string) => {
  // Fetch and transform stored RealPrice.xml into Firestore data
  const realPrice = await fetchStoredRealPriceByDate(date);
  const parsedRealPrice = await parseStringPromise(realPrice.toString());
  const rows = stripRealPriceToRows(parsedRealPrice);
  const transformed: IRealPriceItem[] = rows.map((row: any) => {
    return Object.keys(row).reduce(
      (accu, col) => {
        const colData = row[col][0].$;
        const name = Object.keys(colData)[0];
        return { ...accu, [name]: stringToField(colData[name]) };
      },
      {
        formatted_address: null,
        lat: null,
        lng: null,
      }
    );
  });
  // Expand address by it's No..
  const expanded = transformed.reduce(
    (accu, regionItem) => [...accu, ...expandRawByLocation(regionItem)],
    [] as IRealPriceItem[]
  );
  const preDocRef = await getRealPriceDocRef({ dateBefore: date });
  if (preDocRef) {
    return Promise.all(
      expanded.map(item =>
        preDocRef
          .collection(DB_COLLECTION_ITEMS)
          .where('CASE_T', '==', item.CASE_T)
          .where('DISTRICT', '==', item.DISTRICT)
          .where('CASE_F', '==', item.CASE_F)
          .where('LOCATION', '==', item.LOCATION)
          .where('LANDA', '==', item.LANDA)
          .where('LANDA_Z', '==', item.LANDA_Z)
          .where('SDATE', '==', item.SDATE)
          .where('SCNT', '==', item.SCNT)
          .where('SBUILD', '==', item.SBUILD)
          .where('TBUILD', '==', item.TBUILD)
          .where('PBUILD', '==', item.PBUILD)
          .where('MBUILD', '==', item.MBUILD)
          .where('FDATE', '==', item.FDATE)
          .where('FAREA', '==', item.FAREA)
          .where('BUILD_R', '==', item.BUILD_R)
          .where('BUILD_L', '==', item.BUILD_L)
          .where('BUILD_B', '==', item.BUILD_B)
          .where('BUILD_P', '==', item.BUILD_P)
          .where('RULE', '==', item.RULE)
          .where('BUILD_C', '==', item.BUILD_C)
          .where('TPRICE', '==', item.TPRICE)
          .where('UPRICE', '==', item.UPRICE)
          .where('UPNOTE', '==', item.UPNOTE)
          .where('PARKTYPE', '==', item.PARKTYPE)
          .where('PAREA', '==', item.PAREA)
          .where('PPRICE', '==', item.PPRICE)
          .where('RMNOTE', '==', item.RMNOTE)
          .get()
          .then(snap =>
            snap.docs.length === 1
              ? (snap.docs[0].data() as IRealPriceItem)
              : null
          )
          .then(preItem => {
            if (preItem) {
              item.lat = preItem.lat;
              item.lng = preItem.lng;
              item.formatted_address = preItem.formatted_address;
              item.geocoded = false;
            }
            return item;
          })
      )
    );
  }
  return expanded;
};

const storeTransformed = async (
  date: string,
  transformed: IRealPriceItem[]
) => {
  const db = admin.firestore();
  const doc = await db.collection(DB_COLLECTION_REAL_PRICE).add({
    name: getRealPriceFilename(date),
    date: new Date(date),
  });
  const collection = doc.collection(DB_COLLECTION_ITEMS);

  const chunks: IRealPriceItem[][] = [];
  transformed.forEach((item, index) => {
    if (index % FIRESTORE_BATCH_WRITE_MAX === 0) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(item);
  });
  const batches: FirebaseFirestore.WriteBatch[] = [];
  chunks.forEach(async chunk => {
    const batch = db.batch();
    chunk.forEach(item => {
      batch.set(collection.doc(), item);
    });
    batches.push(batch);
  });
  await Promise.all(batches.map(batch => batch.commit()));
};

const transformSingleDate = async (date: string) => {
  const transformed = await transformByDate(date);
  // console.debug("transformed", transformed);
  await storeTransformed(date, transformed);
};

export const transformPrice = async (
  onSuccess?: (result: TransformResult, message: string) => void
) => {
  // const [prices, dates] = await Promise.all([
  //   fetchPriceDocData(),
  //   fetchStoredRealPriceDates(),
  // ]);
  // console.debug("priceDocs", prices);
  // console.debug("dates", dates);
  // const untransformedDates = getUntransformedDates(prices, dates);

  const [prices, latestStoredFileDate] = await Promise.all([
    fetchPriceDocData(),
    fetchLatestStoredRealPriceDate(),
  ]);
  // console.debug('priceDocs', prices);
  // console.debug('latestStoredFileDate', latestStoredFileDate);
  const untransformedDates = getUntransformedDates(prices, [
    latestStoredFileDate,
  ]);

  // console.debug("untransformedDates", untransformedDates);

  if (untransformedDates.length === 0) {
    const message = 'Already up-to-date.';
    console.info(message);
    if (onSuccess) {
      onSuccess(TransformResult.ALREADY_EXIST, message);
    }
  } else {
    await Promise.all(untransformedDates.map(transformSingleDate));
    const message = `Transform following RealPrice.xml success.\n${untransformedDates
      .map(getRealPriceFilename)
      .join(',\n')}`;
    console.info(message);
    if (onSuccess) {
      onSuccess(TransformResult.TRANSFORM_NEW_FILE, message);
    }
  }
};
