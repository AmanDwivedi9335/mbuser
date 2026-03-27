import { z } from "zod";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const recordCategorySchema = z.enum([
  "LAB_RESULT",
  "PRESCRIPTION",
  "VACCINATION",
  "IMAGING",
  "DISCHARGE_SUMMARY",
  "BILLING",
  "INSURANCE",
  "OTHER",
]);

export const recordMetadataSchema = z.object({
  profileId: z.string().min(1, "Profile is required"),
  category: recordCategorySchema,
  title: z.string().trim().min(2, "Title is required").max(200),
  providerName: z.string().trim().max(200).optional(),
  recordDate: z.string().date().optional(),
  notes: z.string().trim().max(5000).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});

export const listRecordsQuerySchema = z.object({
  profileId: z.string().min(1),
  category: recordCategorySchema.optional(),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
});

export const searchRecordsQuerySchema = z.object({
  profileId: z.string().min(1),
  q: z.string().trim().min(2).max(200),
});

export function validateUploadFile(file: File | null) {
  if (!file) {
    throw new Error("File is required");
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG, and PNG files are allowed");
  }

  if (file.size <= 0) {
    throw new Error("Uploaded file is empty");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds 20MB limit");
  }
}
