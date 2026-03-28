"use client";

import type { VitalType } from "@/features/vitals/types/vitals.types";

const METRICS: Array<{ value: VitalType; label: string }> = [
  { value: "BP", label: "Blood Pressure" },
  { value: "HR", label: "Heart Rate" },
  { value: "WEIGHT", label: "Weight" },
  { value: "SUGAR", label: "Blood Sugar" },
  { value: "SLEEP", label: "Sleep" },
  { value: "STEPS", label: "Steps" },
  { value: "SPO2", label: "SpO2" },
  { value: "TEMP", label: "Temperature" },
];

export function MetricSelector({ value, onChange }: { value: VitalType; onChange: (value: VitalType) => void }) {
  return (
    <select className="rounded-md border border-app-border bg-app-panel px-3 py-2 text-sm" value={value} onChange={(event) => onChange(event.target.value as VitalType)}>
      {METRICS.map((metric) => (
        <option key={metric.value} value={metric.value}>{metric.label}</option>
      ))}
    </select>
  );
}
