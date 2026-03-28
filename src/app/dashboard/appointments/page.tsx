"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AppointmentForm } from "@/features/appointments/components/appointment-form";
import { AppointmentList } from "@/features/appointments/components/appointment-list";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";
import type { AppointmentStatus } from "@/features/appointments/types/appointment.types";

const TABS: AppointmentStatus[] = ["UPCOMING", "COMPLETED", "CANCELLED"];

export default function AppointmentsPage() {
  const { selectedProfile } = useCurrentProfile();
  const [status, setStatus] = useState<AppointmentStatus>("UPCOMING");
  const { appointments, isLoading, error, refresh } = useAppointments(selectedProfile?.id ?? null, status);

  const todayCount = useMemo(() => appointments.filter((item) => item.isToday).length, [appointments]);

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-app-muted">Manage consultations, visit notes, and follow-up care in one workflow.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {selectedProfile ? <AppointmentForm profileId={selectedProfile.id} onCreated={() => void refresh()} /> : null}
        <Link href="/dashboard/appointments/calendar" className="rounded-md border border-app-border px-4 py-2 text-sm">
          Open calendar
        </Link>
      </div>

      <p className="rounded-md bg-blue-500/10 px-3 py-2 text-sm text-blue-300">Today’s appointments: {todayCount}</p>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button key={tab} type="button" onClick={() => setStatus(tab)} className={`rounded-md px-3 py-2 text-sm ${status === tab ? "bg-app-accent text-white" : "border border-app-border"}`}>
            {tab.charAt(0)}{tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {selectedProfile ? (
        <AppointmentList appointments={appointments} isLoading={isLoading} onUpdated={() => void refresh()} />
      ) : (
        <p className="text-sm text-app-muted">Select a profile to manage appointments.</p>
      )}
    </section>
  );
}
