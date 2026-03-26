"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  completeOnboardingClient,
  getOnboardingStatusClient,
  saveOnboardingStepClient,
} from "@/features/onboarding/services/onboarding.client";
import type { OnboardingStepKey, OnboardingStatus, SaveStepPayload } from "@/features/onboarding/types/onboarding.types";

const STEP_ORDER: OnboardingStepKey[] = ["HOUSEHOLD", "PRIMARY_PROFILE", "FAMILY_MEMBERS", "REVIEW"];

export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getOnboardingStatusClient();
      setStatus(result);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load onboarding status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const saveStep = useCallback(async (payload: SaveStepPayload) => {
    setIsSaving(true);

    try {
      const updated = await saveOnboardingStepClient(payload);
      setStatus(updated);
      setError(null);
      return updated;
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save onboarding step";
      setError(message);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const complete = useCallback(async () => {
    setIsSaving(true);

    try {
      const result = await completeOnboardingClient();
      setError(null);
      return result;
    } catch (completeError) {
      const message = completeError instanceof Error ? completeError.message : "Unable to complete onboarding";
      setError(message);
      throw completeError;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const activeStep = useMemo<OnboardingStepKey>(() => {
    if (!status) {
      return "HOUSEHOLD";
    }

    if (status.step === "COMPLETED") {
      return "REVIEW";
    }

    return status.step as OnboardingStepKey;
  }, [status]);

  const progress = useMemo(() => {
    const index = STEP_ORDER.indexOf(activeStep);
    return ((index + 1) / STEP_ORDER.length) * 100;
  }, [activeStep]);

  return {
    status,
    activeStep,
    progress,
    isLoading,
    isSaving,
    error,
    saveStep,
    complete,
    reload: loadStatus,
    steps: STEP_ORDER,
  };
}
