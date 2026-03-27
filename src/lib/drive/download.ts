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
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

export async function downloadEncryptedFileFromDrive(driveFileId: string) {
  const drive = getDriveClient();

  const response = await drive.files.get(
    {
      fileId: driveFileId,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
    },
  );

  const data = response.data;

  if (!data) {
    throw new Error("Drive download returned empty payload");
  }

  return Buffer.from(data as ArrayBuffer);
}
