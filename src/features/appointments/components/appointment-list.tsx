import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import type { AppointmentItem } from "@/features/appointments/types/appointment.types";

export function AppointmentList({ appointments, isLoading, onUpdated }: { appointments: AppointmentItem[]; isLoading: boolean; onUpdated: () => void }) {
  if (isLoading) {
    return <p className="text-sm text-app-muted">Loading appointments...</p>;
  }

  if (appointments.length === 0) {
    return <p className="rounded-xl border border-app-border bg-app-panel p-4 text-sm text-app-muted">No appointments found for this view.</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} onUpdated={onUpdated} />
      ))}
    </div>
  );
}
