"use client";

import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";

export function ProfileSwitcher() {
  const { profiles, selectedProfileId, isLoading, switchProfile } = useCurrentProfile();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-app-muted">Profile</span>
      <select
        value={selectedProfileId ?? ""}
        onChange={(event) => {
          void switchProfile(event.target.value);
        }}
        disabled={isLoading || profiles.length === 0}
        className="rounded-md border border-app-muted/30 bg-app-bg px-2 py-1 text-app-text"
      >
        {profiles.length === 0 ? <option value="">No profiles</option> : null}
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.fullName}
          </option>
        ))}
      </select>
    </label>
  );
}
