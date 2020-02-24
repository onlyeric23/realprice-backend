import get from 'lodash/get';
import { Op } from 'sequelize';
import { parseStringPromise } from 'xml2js';
import { Meta } from '../models/Meta';
import { RawItemTP } from '../models/RawItemTP';
import {
  fetchLatestStoredRealPrice,
  fetchLatestStoredRealPriceDate,
  getRealPriceFilename,
} from './storage';

export enum TransformResult {
  NO_AVAILABLE_FILE,
  ALREADY_EXIST,
  TRANSFORM_NEW_FILE,
}

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

export const transformPrice = async (
  onSuccess?: (result: TransformResult, message: string) => void
) => {
  const latestStoredFileDate = await fetchLatestStoredRealPriceDate();
  if (!latestStoredFileDate) {
    const message = 'No available file';
    if (onSuccess) {
      onSuccess(TransformResult.NO_AVAILABLE_FILE, message);
    }
  }

  const latestTransformedFile = (await Meta.findByPk('LatestTransformedFile'))!;
  const storedFilename = getRealPriceFilename(latestStoredFileDate);
  if (storedFilename === latestTransformedFile.value) {
    const message = 'Already up-to-date';
    if (onSuccess) {
      onSuccess(TransformResult.ALREADY_EXIST, message);
    }
  } else {
    const realprice = await fetchLatestStoredRealPrice();
    const parsedRealPrice = await parseStringPromise(realprice!.toString());
    const rows = stripRealPriceToRows(parsedRealPrice);
    const transformed = rows
      .map((row: any) => {
        return Object.keys(row).reduce((accu, col) => {
          const colData = row[col][0].$;
          const name = Object.keys(colData)[0];
          return { ...accu, [name]: colData[name] };
        }, {});
      })
      .map((item: any) => ({ ...item, id: RawItemTP.generateId(item) }));
    await RawItemTP.bulkCreate(transformed, { ignoreDuplicates: true });
    latestTransformedFile.value = storedFilename;
    await latestTransformedFile.save();
    const message = `Transform ${storedFilename} success.\n`;
    console.info(message);
    if (onSuccess) {
      onSuccess(TransformResult.TRANSFORM_NEW_FILE, message);
    }
  }
};
