"use client";

import { useCallback, useEffect, useState } from "react";

import { listRecords, searchVaultRecords } from "@/features/records/services/records.client";
import type { VaultRecord } from "@/features/records/types/record.types";

export function useRecords(profileId: string | null) {
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setRecords([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await listRecords({ profileId });
      setRecords(response.records);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load records");
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  const search = useCallback(
    async (query: string) => {
      if (!profileId) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await searchVaultRecords(profileId, query);
        setRecords(response.records);
        setError(null);
      } catch (requestError: unknown) {
        setError(requestError instanceof Error ? requestError.message : "Unable to search records");
      } finally {
        setIsLoading(false);
      }
    },
    [profileId],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    records,
    isLoading,
    error,
    refresh,
    search,
  };
}
