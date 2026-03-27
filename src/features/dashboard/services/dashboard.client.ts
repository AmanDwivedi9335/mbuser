import type { CurrentUserResponse, DashboardProfilesResponse } from "@/features/dashboard/types/dashboard.types";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = `Request failed (${response.status})`;
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchCurrentUser() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<CurrentUserResponse>(response);
}

export async function fetchProfiles() {
  const response = await fetch("/api/dashboard/profiles", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return readJson<DashboardProfilesResponse>(response);
}

export async function updateSelectedProfile(profileId: string) {
  const response = await fetch("/api/dashboard/selected-profile", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileId }),
  });

  await readJson<{ ok: boolean }>(response);
}
