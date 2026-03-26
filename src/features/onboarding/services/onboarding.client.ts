import type { OnboardingStatus, SaveStepPayload } from "@/features/onboarding/types/onboarding.types";

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => null)) as T & { error?: string } | null;

  if (!response.ok) {
    throw new Error(json?.error ?? "Request failed");
  }

  return json as T;
}

export async function getOnboardingStatusClient() {
  const response = await fetch("/api/onboarding/status", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse<OnboardingStatus>(response);
}

export async function saveOnboardingStepClient(payload: SaveStepPayload) {
  const response = await fetch("/api/onboarding/save-step", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<OnboardingStatus>(response);
}

export async function completeOnboardingClient() {
  const response = await fetch("/api/onboarding/complete", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse<{ redirectTo: string; completed: boolean }>(response);
}
