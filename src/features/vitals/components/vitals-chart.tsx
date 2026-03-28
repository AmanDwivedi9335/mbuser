"use client";

import { useMemo } from "react";

import type { VitalItem } from "@/features/vitals/types/vitals.types";

function pointsForValues(values: number[], width: number, height: number) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function VitalsChart({ vitals }: { vitals: VitalItem[] }) {
  const values = useMemo(() => vitals.map((item) => item.value1), [vitals]);
  const points = useMemo(() => pointsForValues(values, 600, 220), [values]);

  if (!vitals.length) {
    return <p className="rounded-xl border border-app-border bg-app-panel p-6 text-sm text-app-muted">No chart data for selected filter.</p>;
  }

  return (
    <div className="rounded-xl border border-app-border bg-app-panel p-4">
      <div className="h-[240px] w-full overflow-x-auto">
        <svg viewBox="0 0 600 220" className="h-full min-w-[600px] w-full">
          <polyline fill="none" stroke="currentColor" strokeWidth="3" className="text-app-accent" points={points} />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-xs text-app-muted">
        <span>{new Date(vitals[0].recordedAt).toLocaleDateString()}</span>
        <span>{new Date(vitals[vitals.length - 1].recordedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
