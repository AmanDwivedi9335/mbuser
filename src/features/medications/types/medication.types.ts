export type MedicationFrequencyType =
  | "ONCE_DAILY"
  | "TWICE_DAILY"
  | "THRICE_DAILY"
  | "EVERY_X_HOURS"
  | "WEEKLY"
  | "CUSTOM";

export type MedicationLogStatus = "TAKEN" | "SKIPPED" | "MISSED";

export type ScheduleInput = {
  time: string;
  dayOfWeek?: number | null;
  intervalHours?: number | null;
};

export type MedicationPayload = {
  profileId: string;
  name: string;
  dosage: number;
  unit: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  frequencyType: MedicationFrequencyType;
  schedules: ScheduleInput[];
};

export type MedicationItem = {
  id: string;
  profileId: string;
  name: string;
  dosage: number;
  unit: string;
  instructions: string | null;
  startDate: string;
  endDate: string | null;
  frequencyType: MedicationFrequencyType;
  isActive: boolean;
  createdAt: string;
  schedules: ScheduleInput[];
  nextDoseAt: string | null;
};

export type MedicationListResponse = {
  medications: MedicationItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type MedicationLogItem = {
  id: string;
  medicationId: string;
  profileId: string;
  scheduledAt: string;
  takenAt: string | null;
  status: MedicationLogStatus;
  createdAt: string;
};

export type AdherenceInsights = {
  totalScheduled: number;
  takenCount: number;
  missedCount: number;
  skippedCount: number;
  adherencePercent: number;
  currentStreak: number;
  message: string;
};
