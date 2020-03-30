import crypto from 'crypto';
import { Readable } from 'stream';
import { ABSTRACT_ADDRESS_TP } from './regex';

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

interface ExtendOptions {
  prefix: string;
}
const DEFAULT_EXTEND_OPTIONS: ExtendOptions = {
  prefix: '',
};
export const extendAddress = (
  originalAddress: string,
  options?: Partial<ExtendOptions>
) => {
  const { prefix } = { ...DEFAULT_EXTEND_OPTIONS, ...options };
  const matched = originalAddress.match(ABSTRACT_ADDRESS_TP);
  if (!matched) {
    throw Error(`Location not matched: ${originalAddress}`);
  }
  const [, range, from, to] = matched;
  if (!range || !from || !to) {
    throw Error(`Location not matched: ${originalAddress}`);
  }
  return Array(parseInt(to) - parseInt(from) + 1)
    .fill(0)
    .map((__, index) => {
      const extendedAddress = originalAddress.replace(
        range,
        String(parseInt(from) + index)
      );
      return `${prefix}${extendedAddress}`;
    });
};

/**
 * Check every elements in set b is also in set a.
 */
export const contain = <T>(a: Set<T>, b: Set<T>) => {
  let result = true;
  a.forEach(element => {
    if (!b.has(element)) {
      result = false;
    }
  });
  return result;
};
