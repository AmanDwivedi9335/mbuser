"use client";

import { MedicationCard } from "@/features/medications/components/medication-card";
import type { MedicationItem } from "@/features/medications/types/medication.types";

export function MedicationList({ medications, profileId, isLoading, onLogged }: { medications: MedicationItem[]; profileId: string; isLoading: boolean; onLogged: () => void }) {
  if (isLoading) {
    return <p className="text-sm text-app-muted">Loading medications...</p>;
  }

  if (medications.length === 0) {
    return <p className="rounded-xl border border-app-border bg-app-panel p-4 text-sm text-app-muted">No medications found for this profile.</p>;
  }

  return (
    <div className="space-y-3">
      {medications.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} profileId={profileId} onLogged={onLogged} />
      ))}
    </div>
  );
}
