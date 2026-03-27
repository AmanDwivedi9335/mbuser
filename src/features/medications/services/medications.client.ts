import type { MedicationListResponse, MedicationLogItem, MedicationPayload } from "@/features/medications/types/medication.types";

type MedicationLogResponse = {
  logs: MedicationLogItem[];
};

type AdherenceResponse = {
  insights: {
    totalScheduled: number;
    takenCount: number;
    missedCount: number;
    skippedCount: number;
    adherencePercent: number;
    currentStreak: number;
    message: string;
  };
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function createMedication(payload: MedicationPayload) {
  const response = await fetch("/api/medications/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ medicationId: string }>(response);
}

export async function listMedications(params: {
  profileId: string;
  status?: "active" | "inactive" | "all";
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams({
    profileId: params.profileId,
    status: params.status ?? "active",
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 10),
  });

  const response = await fetch(`/api/medications/list?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<MedicationListResponse>(response);
}

export async function createMedicationLog(payload: {
  profileId: string;
  medicationId: string;
  status: "TAKEN" | "SKIPPED";
  scheduledAt?: string;
}) {
  const response = await fetch("/api/medications/log", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ ok: boolean }>(response);
}

export async function listMedicationLogs(params: {
  profileId: string;
  medicationId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const searchParams = new URLSearchParams({
    profileId: params.profileId,
  });

  if (params.medicationId) searchParams.set("medicationId", params.medicationId);
  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);

  const response = await fetch(`/api/medications/log?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<MedicationLogResponse>(response);
}

export async function getAdherenceInsights(profileId: string) {
  const response = await fetch(`/api/medications/schedule?profileId=${profileId}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<AdherenceResponse>(response);
}
