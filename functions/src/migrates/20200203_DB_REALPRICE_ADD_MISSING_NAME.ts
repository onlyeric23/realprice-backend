import admin = require('firebase-admin');
import { firebaseRequestHandler } from '../core';
import { DB_COLLECTION_REAL_PRICE } from '../core/constant';
import { getRealPriceFilename } from '../core/storage';

export default firebaseRequestHandler(async (_, res) => {
  const db = admin.firestore();
  const docSnaps = await db
    .collection(DB_COLLECTION_REAL_PRICE)
    .get()
    .then(snap => snap.docs);
  const invalidDateDocSnaps = docSnaps.filter(
    snap => !snap.get('name') && snap.get('date')
  );
  if (invalidDateDocSnaps.length === 0) {
    const message = 'Already up-to-date.';
    console.info(message);
    res.send(message).end();
  } else {
    await Promise.all(
      invalidDateDocSnaps.map(snap =>
        snap.ref.update({
          name: getRealPriceFilename(snap.get('date')),
        })
      )
    );
    const message = `Migrate following RealPrice Documents success.\n${invalidDateDocSnaps
      .map(snap => getRealPriceFilename(snap.get('date')))
      .join(',\n')}`;
    console.info(message);
    res.send(message).end();
  }
});
