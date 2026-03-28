import type { AppointmentStatus } from "@/features/appointments/types/appointment.types";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    UPCOMING: "bg-blue-500/20 text-blue-300",
    COMPLETED: "bg-emerald-500/20 text-emerald-300",
    CANCELLED: "bg-red-500/20 text-red-300",
  };

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{status.toLowerCase()}</span>;
}
