import { IFieldResolver } from 'apollo-server-cloud-functions';

import { DB_COLLECTION_ITEMS } from '../core/constant';
import { getRealPriceDocRef } from '../core/db';

const resolver: IFieldResolver<any, any, { location: string }> = async (
  _,
  { location }
) => {
  // const latestRealPriceDocRef = await getRealPriceDocRef();
  // if (latestRealPriceDocRef) {
  //   const item = await latestRealPriceDocRef
  //     .collection(DB_COLLECTION_ITEMS)
  //     .where('LOCATION', '==', location)
  //     .get()
  //     .then(snap => (snap.docs.length > 0 ? snap.docs[0].data() : null));
  //   return [item];
  // }
  return null;
};

export default resolver;
