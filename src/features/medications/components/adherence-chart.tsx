"use client";

import type { AdherenceInsights } from "@/features/medications/types/medication.types";

export function AdherenceChart({ insights }: { insights: AdherenceInsights }) {
  return (
    <section className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4">
      <h3 className="text-base font-semibold">Adherence insights (last 7 days)</h3>

      <div className="h-3 overflow-hidden rounded-full bg-app-border">
        <div className="h-full bg-app-accent" style={{ width: `${insights.adherencePercent}%` }} />
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <p>Adherence: {insights.adherencePercent}%</p>
        <p>Taken: {insights.takenCount}</p>
        <p>Missed: {insights.missedCount}</p>
        <p>Current streak: {insights.currentStreak}</p>
      </div>

      <p className="text-sm text-app-muted">{insights.message}</p>
    </section>
  );
}
