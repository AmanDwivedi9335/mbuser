"use client";

import { useState } from "react";

import { importVitals } from "@/features/vitals/services/vitals.client";
import { inferUnit } from "@/lib/utils/validations/vitals";
import type { VitalType } from "@/features/vitals/types/vitals.types";

export function CsvImport({ profileId, type }: { profileId: string; type: VitalType }) {
  const [csv, setCsv] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        try {
          const response = await importVitals({
            profileId,
            type,
            unit: inferUnit(type),
            source: "CSV",
            csv,
          });

          setMessage(`Imported ${response.inserted} rows, skipped ${response.skipped} invalid rows.`);
          setCsv("");
        } catch (requestError: unknown) {
          setError(requestError instanceof Error ? requestError.message : "Unable to import csv");
        }
      }}
    >
      <label className="text-sm font-medium">CSV data</label>
      <textarea value={csv} onChange={(event) => setCsv(event.target.value)} rows={12} className="w-full rounded-md border border-app-border bg-app-bg p-3 font-mono text-xs" placeholder="date,value\n2026-03-28T07:30:00Z,72" />
      <button type="submit" className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">Import CSV</button>
      {message ? <p className="text-sm text-green-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
