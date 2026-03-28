"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { listVitals } from "@/features/vitals/services/vitals.client";
import type { TimeRange, VitalItem, VitalType } from "@/features/vitals/types/vitals.types";

function getDateRange(range: TimeRange) {
  const end = new Date();
  const start = new Date(end);

  if (range === "7d") start.setDate(end.getDate() - 7);
  if (range === "30d") start.setDate(end.getDate() - 30);
  if (range === "90d") start.setDate(end.getDate() - 90);

  return { fromDate: start.toISOString(), toDate: end.toISOString() };
}

export function useVitals(profileId: string | null, type: VitalType, range: TimeRange) {
  const [vitals, setVitals] = useState<VitalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setVitals([]);
      return;
    }

    setIsLoading(true);

    try {
      const { fromDate, toDate } = getDateRange(range);
      const response = await listVitals({
        profileId,
        type,
        fromDate,
        toDate,
        page: 1,
        pageSize: 100,
        sort: "asc",
      });
      setVitals(response.vitals);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load vitals");
    } finally {
      setIsLoading(false);
    }
  }, [profileId, type, range]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const latest = useMemo(() => vitals[vitals.length - 1] ?? null, [vitals]);

  return {
    vitals,
    latest,
    isLoading,
    error,
    refresh,
  };
}
