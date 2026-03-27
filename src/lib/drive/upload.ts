import { Readable } from "stream";
import { google } from "googleapis";

function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google Drive credentials are not configured");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadEncryptedRecordToDrive(params: {
  encryptedFile: Buffer;
  mimeType: string;
  originalName: string;
}) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured");
  }

  const drive = getDriveClient();

  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}-${params.originalName}.enc`,
      parents: [folderId],
    },
    media: {
      mimeType: "application/octet-stream",
      body: Readable.from(params.encryptedFile),
    },
    fields: "id",
  });

  const id = response.data.id;

  if (!id) {
    throw new Error("Failed to upload encrypted file to Drive");
  }

  return id;
}
