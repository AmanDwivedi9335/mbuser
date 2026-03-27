"use client";

import { useCallback, useEffect, useState } from "react";

import { listMedications } from "@/features/medications/services/medications.client";
import type { MedicationItem } from "@/features/medications/types/medication.types";

export function useMedications(profileId: string | null, status: "active" | "inactive" | "all") {
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setMedications([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await listMedications({ profileId, status });
      setMedications(response.medications);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load medications");
    } finally {
      setIsLoading(false);
    }
  }, [profileId, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    medications,
    isLoading,
    error,
    refresh,
  };
}
