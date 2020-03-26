import crypto from 'crypto';
import { Readable } from 'stream';
import { ADDRESS_TP } from './regex';

export function generateChecksum(
  data: string | Buffer | DataView,
  algorithm: string = 'md5',
  encoding: crypto.HexBase64Latin1Encoding = 'hex'
) {
  return crypto
    .createHash(algorithm)
    .update(data, 'utf8')
    .digest(encoding);
}

export const readableToString = (readable: Readable) => {
  return new Promise<string>((resolve, reject) => {
    let chunks = '';
    readable.on('data', chunk => {
      chunks += chunk;
    });
    readable.on('error', () => {
      reject(new Error('Downloading current RealPrice.xml failed.'));
    });
    readable.on('end', () => {
      resolve(chunks);
    });
  });
};

export const extendAddress = (originalAddress: string) => {
  const matched = originalAddress.match(ADDRESS_TP);
  if (!matched) {
    throw Error(`Location not matched: ${originalAddress}`);
  }
  const [_, range, from, to] = matched;
  if (!range || !from || !to) {
    throw Error(`Location not matched: ${originalAddress}`);
  }
  return Array(parseInt(to) - parseInt(from) + 1)
    .fill(0)
    .map((__, index) =>
      originalAddress.replace(range, String(parseInt(from) + index))
    );
};
