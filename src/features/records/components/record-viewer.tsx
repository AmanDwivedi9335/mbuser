"use client";

import { useMemo } from "react";

import type { VaultRecord } from "@/features/records/types/record.types";

export function RecordViewer({ record }: { record: VaultRecord }) {
  const firstFile = record.files[0] ?? null;

  const fileUrl = useMemo(() => {
    if (!firstFile) {
      return null;
    }

    return `/api/records/${record.id}?download=1&fileId=${firstFile.id}`;
  }, [firstFile, record.id]);

  if (!fileUrl || !firstFile) {
    return <p className="text-sm text-app-muted">No file attached to this record.</p>;
  }

  if (firstFile.mimeType === "application/pdf") {
    return <iframe src={fileUrl} className="h-[600px] w-full rounded-lg border border-app-border" title={record.title} />;
  }

  return <img src={fileUrl} alt={record.title} className="max-h-[600px] w-full rounded-lg border border-app-border object-contain" />;
}
