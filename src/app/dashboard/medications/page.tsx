"use client";

import { useState } from "react";

import { AdherenceChart } from "@/features/medications/components/adherence-chart";
import { MedicationForm } from "@/features/medications/components/medication-form";
import { MedicationList } from "@/features/medications/components/medication-list";
import { MedicationLog } from "@/features/medications/components/medication-log";
import { useMedicationLog } from "@/features/medications/hooks/use-medication-log";
import { useMedications } from "@/features/medications/hooks/use-medications";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";

export default function MedicationsPage() {
  const { selectedProfile } = useCurrentProfile();
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const { medications, isLoading, error, refresh } = useMedications(selectedProfile?.id ?? null, statusFilter);
  const { logs, insights, refresh: refreshLogs } = useMedicationLog(selectedProfile?.id ?? null);

  const handleRefreshAll = async () => {
    await Promise.all([refresh(), refreshLogs()]);
  };

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Medication Tracker</h1>
        <p className="text-app-muted">Track schedules, doses, reminders, and adherence for every household profile.</p>
      </header>

      {selectedProfile ? <MedicationForm profileId={selectedProfile.id} onCreated={() => void handleRefreshAll()} /> : null}

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setStatusFilter("active")} className={`rounded-md px-3 py-2 text-sm ${statusFilter === "active" ? "bg-app-accent text-white" : "border border-app-border"}`}>
          Active
        </button>
        <button type="button" onClick={() => setStatusFilter("inactive")} className={`rounded-md px-3 py-2 text-sm ${statusFilter === "inactive" ? "bg-app-accent text-white" : "border border-app-border"}`}>
          Completed
        </button>
        <button type="button" onClick={() => setStatusFilter("all")} className={`rounded-md px-3 py-2 text-sm ${statusFilter === "all" ? "bg-app-accent text-white" : "border border-app-border"}`}>
          All
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {selectedProfile ? (
        <MedicationList medications={medications} profileId={selectedProfile.id} isLoading={isLoading} onLogged={() => void handleRefreshAll()} />
      ) : (
        <p className="text-sm text-app-muted">Select a profile to manage medications.</p>
      )}

      <AdherenceChart insights={insights} />
      <MedicationLog logs={logs} />
    </section>
  );
}
