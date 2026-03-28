import type { VitalType } from "@/features/vitals/types/vitals.types";

type NormalizedInput = {
  type: VitalType;
  value1: number;
  value2?: number;
  unit: string;
  recordedAt: string;
};

const DEFAULT_UNITS: Record<VitalType, string> = {
  BP: "mmHg",
  HR: "bpm",
  WEIGHT: "kg",
  SUGAR: "mg/dL",
  SLEEP: "h",
  STEPS: "steps",
  SPO2: "%",
  TEMP: "°C",
};

function normalizeWeightToKg(value: number, unit: string) {
  if (["lb", "lbs", "pound", "pounds"].includes(unit.toLowerCase())) {
    return value * 0.453592;
  }

  return value;
}

function normalizeTempToC(value: number, unit: string) {
  if (["f", "°f", "fahrenheit"].includes(unit.toLowerCase())) {
    return (value - 32) * (5 / 9);
  }

  return value;
}

export function normalizeVitalInput(input: NormalizedInput) {
  let value1 = input.value1;
  const value2 = input.value2;
  const normalizedUnit = DEFAULT_UNITS[input.type];

  if (input.type === "WEIGHT") {
    value1 = normalizeWeightToKg(value1, input.unit);
  }

  if (input.type === "TEMP") {
    value1 = normalizeTempToC(value1, input.unit);
  }

  return {
    ...input,
    value1: Number(value1.toFixed(2)),
    value2: typeof value2 === "number" ? Number(value2.toFixed(2)) : undefined,
    unit: normalizedUnit,
    recordedAt: new Date(input.recordedAt).toISOString(),
  };
}

export function inferUnit(type: VitalType) {
  return DEFAULT_UNITS[type];
}
