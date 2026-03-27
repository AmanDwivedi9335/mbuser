import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const rawKey = process.env.RECORDS_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("RECORDS_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(rawKey, "base64");

  if (key.length !== 32) {
    throw new Error("RECORDS_ENCRYPTION_KEY must be a base64 encoded 32-byte key");
  }

  return key;
}

export function decryptBuffer(encryptedWithTag: Buffer, ivBase64: string) {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivBase64, "base64");

  if (encryptedWithTag.length < 17) {
    throw new Error("Encrypted payload is invalid");
  }

  const encrypted = encryptedWithTag.subarray(0, -16);
  const authTag = encryptedWithTag.subarray(-16);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
