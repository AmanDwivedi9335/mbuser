"use client";

import { createMedicationLog } from "@/features/medications/services/medications.client";
import type { MedicationItem } from "@/features/medications/types/medication.types";

function formatDateTime(value: string | null) {
  if (!value) return "No upcoming dose";
  return new Date(value).toLocaleString();
}

export function MedicationCard({ medication, profileId, onLogged }: { medication: MedicationItem; profileId: string; onLogged: () => void }) {
  return (
    <article className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{medication.name}</h3>
          <p className="text-sm text-app-muted">
            {medication.dosage} {medication.unit} • {medication.frequencyType.replaceAll("_", " ")}
          </p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs ${medication.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}`}>
          {medication.isActive ? "Active" : "Completed"}
        </span>
      </div>

      {medication.instructions ? <p className="text-sm">{medication.instructions}</p> : null}
      <p className="text-sm text-app-muted">Next dose: {formatDateTime(medication.nextDoseAt)}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={async () => {
            await createMedicationLog({ profileId, medicationId: medication.id, status: "TAKEN" });
            onLogged();
          }}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
        >
          Mark as taken
        </button>
        <button
          type="button"
          onClick={async () => {
            await createMedicationLog({ profileId, medicationId: medication.id, status: "SKIPPED" });
            onLogged();
          }}
          className="rounded-md border border-app-border px-3 py-2 text-sm"
        >
          Skip
        </button>
      </div>
    </article>
  );
}
