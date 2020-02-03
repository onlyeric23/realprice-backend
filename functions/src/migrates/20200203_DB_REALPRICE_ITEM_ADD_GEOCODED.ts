import admin = require('firebase-admin');
import { firebaseRequestHandler } from '../core';
import {
  DB_COLLECTION_ITEMS,
  DB_COLLECTION_REAL_PRICE,
} from '../core/constant';
import { IRealPriceItem } from '../core/interface';

const fetchAllItems = () => {
  const db = admin.firestore();
  return db
    .collection(DB_COLLECTION_REAL_PRICE)
    .listDocuments()
    .then(docRefs =>
      Promise.all(
        docRefs.flatMap(docRef =>
          docRef
            .collection(DB_COLLECTION_ITEMS)
            .get()
            .then(snap => snap.docs)
        )
      ).then(result => result.flat())
    );
};

const isGeocoded: (data: {
  lat: number;
  lng: number;
  formatted_address: string;
}) => boolean = ({ lat, lng, formatted_address }) =>
  lat != null && lng != null && formatted_address != null;

export default firebaseRequestHandler(async (_, res) => {
  const items = await fetchAllItems();
  await Promise.all(
    items.map(item =>
      item.ref.update({
        geocoded: isGeocoded(item.data() as IRealPriceItem),
      })
    )
  );
  res.sendStatus(200).end();
});
