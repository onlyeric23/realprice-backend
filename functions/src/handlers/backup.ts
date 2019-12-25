import { Readable } from "stream";
import admin from "firebase-admin";
import https from "https";
import {
  GOV_REAL_PRICE_DATA,
  STORAGE_RESOURCES,
  RESOURCE_REAL_PRICE_PREFIX,
  RESOURCE_REAL_PRICE_EXT
} from "../config";
import { ISO8601 } from "../core/regex";
import { generateChecksum } from "../core/utils.js";
import firebaseRequestHandler from "../core/index.js";

const getRealPriceBucketPrefix = (date: Date) =>
  `${STORAGE_RESOURCES}/${RESOURCE_REAL_PRICE_PREFIX}_${date.toISOString()}.${RESOURCE_REAL_PRICE_EXT}`;

const readableToString = (readable: Readable) => {
  return new Promise<string>((resolve, reject) => {
    let chunks = "";
    readable.on("data", chunk => {
      chunks += chunk;
    });
    readable.on("error", () => {
      reject(new Error("Downloading current RealPrice.xml failed."));
    });
    readable.on("end", () => {
      resolve(chunks);
    });
  });
};

const fetchRealPrice = () => {
  return new Promise<Readable>(resolve => {
    https.get(GOV_REAL_PRICE_DATA, resolve);
  }).then(readableToString);
};

const fetchLatestStoredRealPriceDate = () => {
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
        return "";
      }
      return files
        .map(file => {
          const matched = file.name.match(matchPattern);
          return matched as string[];
        })
        .filter(result => !!result)
        .map(matched => matched[1])
        .reduce((max, curr) => (curr > max ? curr : max), "");
    });
};

const fetchLatestStoredRealPrice = () => {
  const bucket = admin.storage().bucket();
  return fetchLatestStoredRealPriceDate()
    .then(dateString =>
      bucket.getFiles({
        prefix: getRealPriceBucketPrefix(new Date(dateString))
      })
    )
    .then(([files]) => files[0])
    .then(file => file.download())
    .then(([contents]) => contents);
};

const backupPrice = firebaseRequestHandler(async (_, response) => {
  const price = await fetchRealPrice();
  const currentChecksum = generateChecksum(price);

  const latestStoredPrice = await fetchLatestStoredRealPrice();
  const latestChecksum = generateChecksum(latestStoredPrice);

  if (currentChecksum === latestChecksum) {
    response.status(200).send("Already up-to-date.");
  } else {
    const backupName = getRealPriceBucketPrefix(new Date());
    const bucket = admin.storage().bucket();
    const stream = bucket.file(backupName).createWriteStream();
    stream.write(price);
    stream.end();
    response.status(200).send(`Backup new file ${price}`);
  }
});

export default backupPrice;
