import type { AppointmentItem, AppointmentListResponse, AppointmentStatus, CreateAppointmentPayload } from "@/features/appointments/types/appointment.types";

type AppointmentDetailResponse = {
  appointment: AppointmentItem & {
    followUps: AppointmentItem[];
  };
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  const response = await fetch("/api/appointments/create", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ appointmentId: string }>(response);
}

export async function listAppointments(params: {
  profileId: string;
  status?: AppointmentStatus;
  page?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  sort?: "asc" | "desc";
}) {
  const searchParams = new URLSearchParams({
    profileId: params.profileId,
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 10),
    sort: params.sort ?? "asc",
  });

  if (params.status) searchParams.set("status", params.status);
  if (params.fromDate) searchParams.set("fromDate", params.fromDate);
  if (params.toDate) searchParams.set("toDate", params.toDate);

  const response = await fetch(`/api/appointments/list?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<AppointmentListResponse>(response);
}

export async function getAppointment(appointmentId: string) {
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<AppointmentDetailResponse>(response);
}

export async function updateAppointmentStatus(payload: { appointmentId: string; status: AppointmentStatus }) {
  const response = await fetch("/api/appointments/update-status", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ ok: true }>(response);
}

export async function addAppointmentNote(payload: { appointmentId: string; content: string }) {
  const response = await fetch("/api/appointments/notes", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ ok: true }>(response);
}

export async function createFollowUp(payload: {
  appointmentId: string;
  mode: "appointment" | "reminder";
  followUpAt: string;
  title?: string;
}) {
  const response = await fetch("/api/appointments/follow-up", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readJson<{ ok: true }>(response);
}
