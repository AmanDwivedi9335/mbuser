import crypto from "crypto";

import { RecordCategory, type Record as PrismaRecord, type RecordFile as PrismaRecordFile, type User } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { decryptBuffer } from "@/lib/encryption/decrypt";
import { encryptBuffer } from "@/lib/encryption/encrypt";
import { downloadEncryptedFileFromDrive } from "@/lib/drive/download";
import { uploadEncryptedRecordToDrive } from "@/lib/drive/upload";

import type { VaultRecord } from "@/features/records/types/record.types";

type RecordCreateInput = {
  profileId: string;
  category: RecordCategory;
  title: string;
  providerName?: string;
  recordDate?: string;
  notes?: string;
  tags?: string[];
};

async function getAuthorizedProfile(userId: string, profileId: string) {
  return prisma.profile.findFirst({
    where: {
      id: profileId,
      household: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });
}

type RecordWithFiles = PrismaRecord & { files: PrismaRecordFile[] };

function mapRecord(record: RecordWithFiles): VaultRecord {
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    id: record.id,
    profileId: record.profileId,
    category: record.category,
    title: record.title,
    providerName: record.providerName,
    recordDate: record.recordDate ? record.recordDate.toISOString() : null,
    notes: record.notes,
    tags,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    files: record.files.map((file) => ({
      id: file.id,
      mimeType: file.mimeType,
      originalName: file.originalName,
      size: file.size,
      createdAt: file.createdAt.toISOString(),
    })),
  };
}

async function extractTextFromFile(file: File, fileBuffer: Buffer) {
  if (file.type === "application/pdf") {
    const asText = fileBuffer.toString("latin1");
    return asText.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ").slice(0, 20000);
  }

  if (file.type.startsWith("image/")) {
    return `Image record uploaded: ${file.name}`;
  }

  return "";
}

export async function createRecordWithUpload(params: {
  user: User;
  file: File;
  metadata: RecordCreateInput;
}) {
  const profile = await getAuthorizedProfile(params.user.id, params.metadata.profileId);

  if (!profile) {
    throw new Error("Profile not found or not authorized");
  }

  const fileBuffer = Buffer.from(await params.file.arrayBuffer());
  const extractedText = await extractTextFromFile(params.file, fileBuffer);
  const encrypted = encryptBuffer(fileBuffer);
  const driveFileId = await uploadEncryptedRecordToDrive({
    encryptedFile: encrypted.encrypted,
    mimeType: params.file.type,
    originalName: params.file.name,
  });

  const record = await prisma.record.create({
    data: {
      profileId: profile.id,
      category: params.metadata.category,
      title: params.metadata.title,
      providerName: params.metadata.providerName || null,
      recordDate: params.metadata.recordDate ? new Date(params.metadata.recordDate) : null,
      notes: params.metadata.notes || null,
      tags: params.metadata.tags ?? [],
      extractedText,
      files: {
        create: {
          driveFileId,
          mimeType: params.file.type,
          originalName: params.file.name,
          size: params.file.size,
          encryptionIv: encrypted.iv,
          checksum: encrypted.checksum,
        },
      },
    },
    include: {
      files: true,
    },
  });

  return mapRecord(record);
}

export async function listRecordsForProfile(params: {
  userId: string;
  profileId: string;
  category?: RecordCategory;
  fromDate?: string;
  toDate?: string;
}) {
  const profile = await getAuthorizedProfile(params.userId, params.profileId);

  if (!profile) {
    throw new Error("Profile not found or not authorized");
  }

  const records = await prisma.record.findMany({
    where: {
      profileId: params.profileId,
      deletedAt: null,
      category: params.category,
      recordDate: params.fromDate || params.toDate ? {
        gte: params.fromDate ? new Date(params.fromDate) : undefined,
        lte: params.toDate ? new Date(params.toDate) : undefined,
      } : undefined,
    },
    include: {
      files: true,
    },
    orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
  });

  return records.map(mapRecord);
}

export async function searchRecords(params: { userId: string; profileId: string; query: string }) {
  const profile = await getAuthorizedProfile(params.userId, params.profileId);

  if (!profile) {
    throw new Error("Profile not found or not authorized");
  }

  const records = await prisma.record.findMany({
    where: {
      profileId: params.profileId,
      deletedAt: null,
      OR: [
        { title: { contains: params.query } },
        { notes: { contains: params.query } },
        { extractedText: { contains: params.query } },
      ],
    },
    include: {
      files: true,
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
  });

  return records.map(mapRecord);
}

export async function getRecordDetails(params: { userId: string; recordId: string }) {
  const record = await prisma.record.findFirst({
    where: {
      id: params.recordId,
      deletedAt: null,
      profile: {
        household: {
          members: {
            some: {
              userId: params.userId,
            },
          },
        },
      },
    },
    include: {
      files: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!record) {
    throw new Error("Record not found");
  }

  return mapRecord(record);
}

export async function softDeleteRecord(params: { userId: string; recordId: string }) {
  const record = await prisma.record.findFirst({
    where: {
      id: params.recordId,
      deletedAt: null,
      profile: {
        household: {
          members: {
            some: {
              userId: params.userId,
            },
          },
        },
      },
    },
  });

  if (!record) {
    throw new Error("Record not found");
  }

  await prisma.record.update({
    where: { id: params.recordId },
    data: { deletedAt: new Date() },
  });
}

export async function getDecryptedRecordFile(params: { userId: string; recordId: string; fileId?: string }) {
  const record = await prisma.record.findFirst({
    where: {
      id: params.recordId,
      deletedAt: null,
      profile: {
        household: {
          members: {
            some: {
              userId: params.userId,
            },
          },
        },
      },
    },
    include: {
      files: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!record || record.files.length === 0) {
    throw new Error("Record file not found");
  }

  const file = params.fileId ? record.files.find((entry) => entry.id === params.fileId) : record.files[0];

  if (!file) {
    throw new Error("Requested file not found");
  }

  const encryptedBuffer = await downloadEncryptedFileFromDrive(file.driveFileId);
  const decrypted = decryptBuffer(encryptedBuffer, file.encryptionIv);
  const checksum = crypto.createHash("sha256").update(decrypted).digest("hex");

  if (checksum !== file.checksum) {
    throw new Error("File integrity check failed");
  }

  return {
    buffer: decrypted,
    mimeType: file.mimeType,
    originalName: file.originalName,
  };
}
