import crypto from "crypto";
import { Readable } from "stream";

export function generateChecksum(
  data: string | Buffer | DataView,
  algorithm: string = "md5",
  encoding: crypto.HexBase64Latin1Encoding = "hex"
) {
  return crypto
    .createHash(algorithm)
    .update(data, "utf8")
    .digest(encoding);
}

export const readableToString = (readable: Readable) => {
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
