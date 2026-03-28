import type { VitalListResponse, VitalType, VitalSource } from "@/features/vitals/types/vitals.types";

type CreateVitalPayload = {
  profileId: string;
  type: VitalType;
  value1: number;
  value2?: number;
  unit: string;
  source?: VitalSource;
  recordedAt: string;
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function createVital(payload: CreateVitalPayload) {
  const response = await fetch("/api/vitals/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ vitalId: string }>(response);
}

export async function listVitals(params: {
  profileId: string;
  type?: VitalType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  sort?: "asc" | "desc";
}) {
  const searchParams = new URLSearchParams({
    profileId: params.profileId,
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 50),
    sort: params.sort ?? "desc",
  });

  if (params.type) searchParams.set("type", params.type);
  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);

  const response = await fetch(`/api/vitals/list?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<VitalListResponse>(response);
}

export async function deleteVital(vitalId: string) {
  const response = await fetch("/api/vitals/delete", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vitalId }),
  });

  return readJson<{ ok: true }>(response);
}

export async function importVitals(payload: {
  profileId: string;
  type: VitalType;
  unit: string;
  source?: VitalSource;
  csv: string;
}) {
  const response = await fetch("/api/vitals/import", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ inserted: number; skipped: number }>(response);
}
