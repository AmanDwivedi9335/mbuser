"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { fetchProfiles, updateSelectedProfile } from "@/features/dashboard/services/dashboard.client";
import type { DashboardProfile } from "@/features/dashboard/types/dashboard.types";

const STORAGE_KEY = "medivault:selected-profile-id";

type CurrentProfileContextValue = {
  profiles: DashboardProfile[];
  selectedProfile: DashboardProfile | null;
  selectedProfileId: string | null;
  isLoading: boolean;
  error: string | null;
  switchProfile: (profileId: string) => Promise<void>;
  refreshProfiles: () => Promise<void>;
};

const CurrentProfileContext = createContext<CurrentProfileContextValue | undefined>(undefined);

function resolveSelectedProfileId(profiles: DashboardProfile[], selectedFromApi: string | null) {
  if (profiles.length === 0) {
    return null;
  }

  const selectedFromStorage = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
  const candidates = [selectedFromStorage, selectedFromApi, profiles.find((profile) => profile.isPrimary)?.id, profiles[0]?.id];

  for (const candidate of candidates) {
    if (candidate && profiles.some((profile) => profile.id === candidate)) {
      return candidate;
    }
  }

  return null;
}

export function CurrentProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<DashboardProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfiles = async () => {
    setIsLoading(true);

    try {
      const data = await fetchProfiles();
      const nextSelectedProfileId = resolveSelectedProfileId(data.profiles, data.selectedProfileId);

      setProfiles(data.profiles);
      setSelectedProfileId(nextSelectedProfileId);
      setError(null);

      if (nextSelectedProfileId) {
        window.localStorage.setItem(STORAGE_KEY, nextSelectedProfileId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load profiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshProfiles();
  }, []);

  const switchProfile = async (profileId: string) => {
    setSelectedProfileId(profileId);
    window.localStorage.setItem(STORAGE_KEY, profileId);

    try {
      await updateSelectedProfile(profileId);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update profile");
      await refreshProfiles();
    }
  };

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  );

  const value = useMemo(
    () => ({
      profiles,
      selectedProfile,
      selectedProfileId,
      isLoading,
      error,
      switchProfile,
      refreshProfiles,
    }),
    [profiles, selectedProfile, selectedProfileId, isLoading, error],
  );

  return <CurrentProfileContext.Provider value={value}>{children}</CurrentProfileContext.Provider>;
}

export function useCurrentProfile() {
  const context = useContext(CurrentProfileContext);

  if (!context) {
    throw new Error("useCurrentProfile must be used within CurrentProfileProvider");
  }

  return context;
}
