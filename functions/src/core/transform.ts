import get from 'lodash/get';
import { parseStringPromise } from 'xml2js';
import { LocationAssociation } from '../models/LocationAssociation';
import { RawItemTP } from '../models/RawItemTP';
import { RawLocation } from '../models/RawLocation';
import { TransformedFile } from '../models/TransformedFile';
import {
  fetchLatestStoredRealPriceDate,
  fetchStoredRealPriceByDate,
  fetchStoredRealPriceDates,
  getRealPriceFilename,
} from './storage';
import { extendAddress } from './utils';

export enum TransformResult {
  NO_AVAILABLE_FILE,
  ALREADY_EXIST,
  TRANSFORM_NEW_FILE,
}

export const stripRealPriceToRows = (parsedRealPrice: any) => {
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

export const transformBufferedFile = async (buffer: Buffer) => {
  const parsedRealPrice = await parseStringPromise(buffer.toString());
  const rows = stripRealPriceToRows(parsedRealPrice);
  const transformed = rows
    .map((row: any) => {
      return Object.keys(row).reduce((accu, col) => {
        const colData = row[col][0].$;
        const colName = Object.keys(colData)[0];
        return { ...accu, [colName]: colData[colName] };
      }, {});
    })
    .map((item: any) => ({
      ...item,
      hash: RawItemTP.generateHash(item),
      soldDate: RawItemTP.getDateBySDATE(item.SDATE),
    }));
  return transformed;
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

  const dates = await fetchStoredRealPriceDates();
  const transformedFiles = [] as Array<{
    name: string;
    num_entries: number;
  }>;
  await Promise.all(
    dates.map(async date => {
      const name = getRealPriceFilename(date);
      const file = await TransformedFile.findOne({
        where: {
          name,
        },
      });
      if (!file) {
        const buffer = await fetchStoredRealPriceByDate(date);
        const transformeds = await transformBufferedFile(buffer);
        const rawItems = await RawItemTP.bulkCreate(transformeds, {
          ignoreDuplicates: true,
        });
        await Promise.all(
          rawItems
            .filter(item => !!item.id)
            .map(item => addRawLocationByRawItemTp(item))
        );
        transformedFiles.push({
          name,
          num_entries: transformeds.length,
        });
      }
    })
  );

  if (transformedFiles.length === 0) {
    const message = 'Already up-to-date';
    if (onSuccess) {
      onSuccess(TransformResult.ALREADY_EXIST, message);
    }
  } else {
    await TransformedFile.bulkCreate(transformedFiles);
    const message = [
      'Transform following files success.',
      ...transformedFiles.map(({ name }) => name),
    ].join('\n');
    console.info(message);
    if (onSuccess) {
      onSuccess(TransformResult.TRANSFORM_NEW_FILE, message);
    }
  }
};

const addRawLocationByRawItemTp = async (rawItem: RawItemTP) => {
  try {
    const extendeds = extendAddress(rawItem.LOCATION, {
      prefix: `台北市${rawItem.DISTRICT}`,
    });
    const locations = await RawLocation.bulkCreate(
      extendeds.map(location => ({
        location,
      })),
      {
        ignoreDuplicates: true,
      }
    );
    await LocationAssociation.bulkCreate(
      locations
        .filter(location => !!location.id)
        .map(location => ({
          locationId: location.id,
          rawItemTPId: rawItem.id,
        })),
      {
        ignoreDuplicates: true,
      }
    );
  } catch {
    console.warn('Skip raw item', rawItem.toJSON());
  }
};
