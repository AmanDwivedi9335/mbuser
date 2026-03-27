import { notFound } from "next/navigation";

import { requireSessionUser } from "@/lib/auth/require-user";
import { getMedicationById } from "@/features/medications/services/medications.server";

export default async function MedicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();

  if (!user) {
    notFound();
  }

  try {
    const { id } = await params;
    const medication = await getMedicationById({ userId: user.id, medicationId: id });

    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">{medication.name}</h1>
        <p className="text-app-muted">
          {medication.dosage} {medication.unit} • {medication.frequencyType.replaceAll("_", " ")}
        </p>
        <p className="text-sm">{medication.instructions || "No instructions"}</p>
        <ul className="space-y-2">
          {medication.schedules.map((schedule, index) => (
            <li key={`${schedule.time}-${index}`} className="rounded-md border border-app-border bg-app-panel px-3 py-2 text-sm">
              {schedule.dayOfWeek !== null && schedule.dayOfWeek !== undefined ? `Day ${schedule.dayOfWeek} ` : ""}
              {schedule.time}
              {schedule.intervalHours ? ` • every ${schedule.intervalHours}h` : ""}
            </li>
          ))}
        </ul>
      </section>
    );
  } catch {
    notFound();
  }
}
