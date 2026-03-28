import type { VitalItem } from "@/features/vitals/types/vitals.types";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getVitalStats(vitals: VitalItem[]) {
  const values = vitals.map((item) => item.value1);

  if (!values.length) {
    return {
      average: 0,
      min: 0,
      max: 0,
      trend: "stable" as const,
      message: "No enough data yet.",
    };
  }

  const avg = average(values);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const first = values[0];
  const last = values[values.length - 1];
  const diff = last - first;

  const trend = Math.abs(diff) < 1 ? "stable" : diff > 0 ? "increasing" : "decreasing";

  return {
    average: Number(avg.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    trend,
    message:
      trend === "increasing"
        ? "Your metric is trending upward"
        : trend === "decreasing"
          ? "Your metric is trending downward"
          : "Your metric is stable",
  };
}
