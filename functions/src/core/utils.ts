import crypto from "crypto";

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
