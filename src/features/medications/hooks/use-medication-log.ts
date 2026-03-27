"use client";

import { useCallback, useEffect, useState } from "react";

import { getAdherenceInsights, listMedicationLogs } from "@/features/medications/services/medications.client";
import type { AdherenceInsights, MedicationLogItem } from "@/features/medications/types/medication.types";

const DEFAULT_INSIGHTS: AdherenceInsights = {
  totalScheduled: 0,
  takenCount: 0,
  missedCount: 0,
  skippedCount: 0,
  adherencePercent: 100,
  currentStreak: 0,
  message: "No doses logged yet.",
};

export function useMedicationLog(profileId: string | null, medicationId?: string) {
  const [logs, setLogs] = useState<MedicationLogItem[]>([]);
  const [insights, setInsights] = useState<AdherenceInsights>(DEFAULT_INSIGHTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setLogs([]);
      setInsights(DEFAULT_INSIGHTS);
      return;
    }

    setIsLoading(true);

    try {
      const [logsResponse, insightsResponse] = await Promise.all([
        listMedicationLogs({ profileId, medicationId }),
        getAdherenceInsights(profileId),
      ]);

      setLogs(logsResponse.logs);
      setInsights(insightsResponse.insights);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load medication logs");
    } finally {
      setIsLoading(false);
    }
  }, [profileId, medicationId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    logs,
    insights,
    isLoading,
    error,
    refresh,
  };
}
