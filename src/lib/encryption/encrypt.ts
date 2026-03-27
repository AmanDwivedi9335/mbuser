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

export function encryptBuffer(buffer: Buffer) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: Buffer.concat([encrypted, authTag]),
    iv: iv.toString("base64"),
    checksum: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}
