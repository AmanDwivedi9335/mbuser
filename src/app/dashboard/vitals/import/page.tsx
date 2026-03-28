"use client";

import { useState } from "react";

import { CsvImport } from "@/features/vitals/components/csv-import";
import { MetricSelector } from "@/features/vitals/components/metric-selector";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import type { VitalType } from "@/features/vitals/types/vitals.types";

export default function VitalsImportPage() {
  const { selectedProfile } = useCurrentProfile();
  const [metric, setMetric] = useState<VitalType>("HR");

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Import Vitals CSV</h1>
        <p className="text-app-muted">Upload wearable exports, normalize data, and sync metrics to profile history.</p>
      </header>

      <MetricSelector value={metric} onChange={setMetric} />

      {selectedProfile ? <CsvImport profileId={selectedProfile.id} type={metric} /> : <p className="text-sm text-app-muted">Select a profile before importing CSV data.</p>}
    </section>
  );
}
