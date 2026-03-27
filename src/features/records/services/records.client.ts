import type { RecordListResponse, RecordSearchResponse, UploadRecordPayload, VaultRecord } from "@/features/records/types/record.types";

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return payload as T;
}

export async function uploadRecord(file: File, payload: UploadRecordPayload) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("profileId", payload.profileId);
  formData.append("category", payload.category);
  formData.append("title", payload.title);

  if (payload.providerName) {
    formData.append("providerName", payload.providerName);
  }

  if (payload.recordDate) {
    formData.append("recordDate", payload.recordDate);
  }

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  if (payload.tags && payload.tags.length > 0) {
    formData.append("tags", JSON.stringify(payload.tags));
  }

  const response = await fetch("/api/records/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return readJson<{ record: VaultRecord }>(response);
}

export async function listRecords(params: { profileId: string; category?: string; fromDate?: string; toDate?: string }) {
  const search = new URLSearchParams({ profileId: params.profileId });

  if (params.category) {
    search.set("category", params.category);
  }

  if (params.fromDate) {
    search.set("fromDate", params.fromDate);
  }

  if (params.toDate) {
    search.set("toDate", params.toDate);
  }

  const response = await fetch(`/api/records/list?${search.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<RecordListResponse>(response);
}

export async function searchVaultRecords(profileId: string, query: string) {
  const search = new URLSearchParams({ profileId, q: query });

  const response = await fetch(`/api/records/search?${search.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<RecordSearchResponse>(response);
}

export async function getRecord(recordId: string) {
  const response = await fetch(`/api/records/${recordId}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<{ record: VaultRecord }>(response);
}

export async function deleteRecord(recordId: string) {
  const response = await fetch(`/api/records/${recordId}/delete`, {
    method: "POST",
    credentials: "include",
  });

  return readJson<{ ok: boolean }>(response);
}
