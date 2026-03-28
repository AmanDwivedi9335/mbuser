"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { VitalForm } from "@/features/vitals/components/vital-form";
import { VitalsChart } from "@/features/vitals/components/vitals-chart";
import { VitalsList } from "@/features/vitals/components/vitals-list";
import { MetricSelector } from "@/features/vitals/components/metric-selector";
import { useVitals } from "@/features/vitals/hooks/use-vitals";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import { getVitalStats } from "@/lib/analytics/vitals";
import type { TimeRange, VitalType } from "@/features/vitals/types/vitals.types";

const RANGES: TimeRange[] = ["7d", "30d", "90d"];

export default function VitalsPage() {
  const { selectedProfile } = useCurrentProfile();
  const [metric, setMetric] = useState<VitalType>("HR");
  const [range, setRange] = useState<TimeRange>("30d");
  const { vitals, isLoading, error, refresh } = useVitals(selectedProfile?.id ?? null, metric, range);

  const insights = useMemo(() => getVitalStats(vitals), [vitals]);

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Vitals Tracking</h1>
        <p className="text-app-muted">Track key health metrics, visualize trends, and import wearable data.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {selectedProfile ? <VitalForm profileId={selectedProfile.id} type={metric} onCreated={() => void refresh()} /> : null}
        <Link href="/dashboard/vitals/import" className="rounded-md border border-app-border px-4 py-2 text-sm">Import CSV</Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MetricSelector value={metric} onChange={setMetric} />
        {RANGES.map((item) => (
          <button key={item} type="button" className={`rounded-md px-3 py-2 text-sm ${item === range ? "bg-app-accent text-white" : "border border-app-border"}`} onClick={() => setRange(item)}>
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-app-border bg-app-panel p-3"><p className="text-xs text-app-muted">Average</p><p className="text-xl font-semibold">{insights.average}</p></div>
        <div className="rounded-xl border border-app-border bg-app-panel p-3"><p className="text-xs text-app-muted">Range</p><p className="text-xl font-semibold">{insights.min} - {insights.max}</p></div>
        <div className="rounded-xl border border-app-border bg-app-panel p-3"><p className="text-xs text-app-muted">Trend</p><p className="text-xl font-semibold capitalize">{insights.trend}</p></div>
      </div>

      <p className="rounded-md bg-blue-500/10 px-3 py-2 text-sm text-blue-300">{insights.message}</p>

      <VitalsChart vitals={vitals} />

      {selectedProfile ? <VitalsList vitals={vitals.slice().reverse()} isLoading={isLoading} onDeleted={() => void refresh()} /> : <p className="text-sm text-app-muted">Select a profile to manage vitals.</p>}
    </section>
  );
}
