import firebaseRequestHandler from "../core/index.js";
import { parseStringPromise } from "xml2js";
import {
  fetchStoredRealPriceDates,
  getRealPriceFilename,
  fetchStoredRealPriceByDate
} from "../core/storage.js";
import admin from "firebase-admin";
import { DB_COLLECTION_REAL_PRICE, DB_COLLECTION_ITEMS } from "../config.js";
import get from "lodash/get";
import { RealPriceItem } from "../interface.js";

const fetchPriceDocData = async () => {
  const db = admin.firestore();
  return await db
    .collection(DB_COLLECTION_REAL_PRICE)
    .get()
    .then(snap => snap.docs.map(doc => doc.data()));
};

const getUntransformedDates = (
  prices: FirebaseFirestore.DocumentData[],
  dates: string[]
) => {
  const priceNameSet = new Set(prices.map(price => price.name));
  return dates.reduce((accu, date) => {
    return priceNameSet.has(getRealPriceFilename(date))
      ? accu
      : [...accu, date];
  }, [] as string[]);
};

const stripRealPriceToRows = (parsedRealPrice: any) => {
  return get(parsedRealPrice, [
    "soap:Envelope",
    "soap:Body",
    0,
    "RPWeekDataResponse",
    0,
    "RPWeekDataResult",
    0,
    "Rows",
    0,
    "Row"
  ]);
};

const transformByDate = async (date: string) => {
  const realPrice = await fetchStoredRealPriceByDate(date);
  const parsedRealPrice = await parseStringPromise(realPrice.toString());
  const rows = stripRealPriceToRows(parsedRealPrice);
  const transformed = rows.map((row: any) => {
    return Object.keys(row).reduce((accu, col) => {
      const colData = row[col][0]["$"];
      const name = Object.keys(colData)[0];
      const value = colData[name];
      return { ...accu, [name]: value };
    }, {});
  });
  return transformed;
};

const storeTransformed = async (date: string, transformed: RealPriceItem[]) => {
  const db = admin.firestore();
  const doc = await db.collection(DB_COLLECTION_REAL_PRICE).add({
    name: getRealPriceFilename(date)
  });
  await Promise.all(
    transformed.map(item => doc.collection(DB_COLLECTION_ITEMS).add(item))
  );
};

export const transformPrice = firebaseRequestHandler(async (_, response) => {
  const [prices, dates] = await Promise.all([
    fetchPriceDocData(),
    fetchStoredRealPriceDates()
  ]);

  // console.debug("priceDocs", prices);
  // console.debug("dates", dates);

  const untransformedDates = getUntransformedDates(prices, dates);

  // console.debug("untransformedDates", untransformedDates);

  if (untransformedDates.length === 0) {
    const message = "Already up-to-date.";
    console.info(message);
    response
      .status(200)
      .send(message)
      .end();
  } else {
    untransformedDates.forEach(async date => {
      const transformed = await transformByDate(date);
      // console.debug("transformed", transformed);
      await storeTransformed(date, transformed);
    });
    const message = `Transform following RealPrice.xml success.\n${untransformedDates
      .map(getRealPriceFilename)
      .join(",\n")}`;
    console.info(message);
    response
      .status(200)
      .send(message)
      .end();
  }
});
