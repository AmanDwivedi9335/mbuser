"use client";

import Link from "next/link";

import { CalendarView } from "@/features/appointments/components/calendar-view";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import { useCurrentProfile } from "@/features/dashboard/hooks/use-current-profile";

export default function AppointmentCalendarPage() {
  const { selectedProfile } = useCurrentProfile();
  const { appointments, isLoading, error } = useAppointments(selectedProfile?.id ?? null);

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Appointments calendar</h1>
          <p className="text-app-muted">Month view of scheduled consultations and follow-ups.</p>
        </div>
        <Link href="/dashboard/appointments" className="rounded-md border border-app-border px-4 py-2 text-sm">
          Back to list
        </Link>
      </header>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {isLoading ? <p className="text-sm text-app-muted">Loading calendar...</p> : null}
      {!isLoading && selectedProfile ? <CalendarView appointments={appointments} /> : null}
      {!selectedProfile ? <p className="text-sm text-app-muted">Select a profile to view appointments.</p> : null}
    </section>
  );
}
