"use client";

import { useState } from "react";

import { uploadRecord } from "@/features/records/services/records.client";
import type { UploadRecordPayload, VaultRecord } from "@/features/records/types/record.types";

export function useUploadRecord() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, payload: UploadRecordPayload): Promise<VaultRecord> => {
    setIsUploading(true);

    try {
      const response = await uploadRecord(file, payload);
      setError(null);
      return response.record;
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Upload failed";
      setError(message);
      throw requestError;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    error,
  };
}
