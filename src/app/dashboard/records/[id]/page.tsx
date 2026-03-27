"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteRecord, getRecord } from "@/features/records/services/records.client";
import { RecordViewer } from "@/features/records/components/record-viewer";
import type { VaultRecord } from "@/features/records/types/record.types";

export default function RecordDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [record, setRecord] = useState<VaultRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void (async () => {
      const resolved = await params;

      try {
        const response = await getRecord(resolved.id);
        setRecord(response.record);
      } catch (requestError: unknown) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load record");
      }
    })();
  }, [params]);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!record) {
    return <p className="text-sm text-app-muted">Loading record...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{record.title}</h1>
          <p className="text-sm text-app-muted">{record.category.replaceAll("_", " ")}</p>
        </div>
        <button
          disabled={isDeleting}
          className="rounded-md border border-red-400 px-3 py-2 text-sm text-red-500 disabled:opacity-60"
          onClick={async () => {
            setIsDeleting(true);
            await deleteRecord(record.id);
            router.push("/dashboard/records");
          }}
        >
          {isDeleting ? "Deleting..." : "Delete record"}
        </button>
      </div>

      <RecordViewer record={record} />
    </section>
  );
}
