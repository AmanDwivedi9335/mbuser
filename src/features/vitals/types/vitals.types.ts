export const VITAL_TYPES = ["BP", "HR", "WEIGHT", "SUGAR", "SLEEP", "STEPS", "SPO2", "TEMP"] as const;

export type VitalType = (typeof VITAL_TYPES)[number];
export type VitalSource = "MANUAL" | "CSV" | "WEARABLE";

export type VitalItem = {
  id: string;
  profileId: string;
  type: VitalType;
  value1: number;
  value2: number | null;
  unit: string;
  source: VitalSource;
  recordedAt: string;
  createdAt: string;
};

export type VitalListResponse = {
  vitals: VitalItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type TimeRange = "7d" | "30d" | "90d";
