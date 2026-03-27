"use client";

import { useState } from "react";

import { useUploadRecord } from "@/features/records/hooks/use-upload-record";
import { RecordMetadataForm } from "@/features/records/components/record-metadata-form";
import type { UploadRecordPayload, VaultRecord } from "@/features/records/types/record.types";

export function UploadForm({ profileId, onUploaded }: { profileId: string; onUploaded: (record: VaultRecord) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [payload, setPayload] = useState<UploadRecordPayload>({
    profileId,
    category: "OTHER",
    title: "",
    providerName: "",
    recordDate: "",
    notes: "",
    tags: [],
  });

  const { upload, isUploading, error } = useUploadRecord();

  return (
    <form
      className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4"
      onSubmit={async (event) => {
        event.preventDefault();

        if (!file) {
          return;
        }

        const record = await upload(file, { ...payload, profileId });
        onUploaded(record);
        setFile(null);
        setPayload((prev) => ({ ...prev, title: "", providerName: "", recordDate: "", notes: "" }));
      }}
    >
      <p className="text-base font-semibold">Upload medical document</p>
      <p className="text-sm text-app-muted">Files are encrypted before being stored in Google Drive.</p>

      <input
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        capture="environment"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="block w-full text-sm"
        required
      />

      <RecordMetadataForm value={payload} onChange={setPayload} />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={!file || isUploading || payload.title.trim().length < 2}
        className="rounded-md bg-app-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isUploading ? "Uploading..." : "Upload record"}
      </button>
    </form>
  );
}
