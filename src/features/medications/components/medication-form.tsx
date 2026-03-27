"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/features/auth/schemas/zod-resolver";
import { ScheduleBuilder } from "@/features/medications/components/schedule-builder";
import { createMedicationSchema } from "@/features/medications/schemas/medication.schema";
import { createMedication } from "@/features/medications/services/medications.client";
import type { MedicationFrequencyType, MedicationPayload, ScheduleInput } from "@/features/medications/types/medication.types";

type MedicationFormProps = {
  profileId: string;
  onCreated: () => void;
};

const FREQUENCY_OPTIONS: { label: string; value: MedicationFrequencyType }[] = [
  { label: "Once daily", value: "ONCE_DAILY" },
  { label: "Twice daily", value: "TWICE_DAILY" },
  { label: "Thrice daily", value: "THRICE_DAILY" },
  { label: "Every X hours", value: "EVERY_X_HOURS" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Custom", value: "CUSTOM" },
];

export function MedicationForm({ profileId, onCreated }: MedicationFormProps) {
  const [schedules, setSchedules] = useState<ScheduleInput[]>([{ time: "08:00" }]);
  const [frequencyType, setFrequencyType] = useState<MedicationFrequencyType>("ONCE_DAILY");
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<MedicationPayload>({
    resolver: zodResolver(createMedicationSchema),
    defaultValues: {
      profileId,
      name: "",
      dosage: 1,
      unit: "mg",
      instructions: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      frequencyType: "ONCE_DAILY",
      schedules,
    },
  });

  return (
    <form
      className="space-y-3 rounded-xl border border-app-border bg-app-panel p-4"
      onSubmit={handleSubmit(async (values) => {
        setError(null);

        try {
          await createMedication({
            ...values,
            profileId,
            frequencyType,
            schedules,
            endDate: values.endDate || undefined,
            instructions: values.instructions || undefined,
          });
          reset({
            profileId,
            name: "",
            dosage: 1,
            unit: "mg",
            instructions: "",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: "",
            frequencyType: "ONCE_DAILY",
            schedules: [{ time: "08:00" }],
          });
          setSchedules([{ time: "08:00" }]);
          setFrequencyType("ONCE_DAILY");
          onCreated();
        } catch (requestError: unknown) {
          setError(requestError instanceof Error ? requestError.message : "Unable to create medication");
        }
      })}
    >
      <h2 className="text-lg font-semibold">Add medication</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <input {...register("name")} placeholder="Medication name" className="rounded-md border border-app-border bg-transparent px-3 py-2" required />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.1" min={0.1} {...register("dosage", { valueAsNumber: true })} placeholder="Dosage" className="rounded-md border border-app-border bg-transparent px-3 py-2" required />
          <input {...register("unit")} placeholder="Unit (mg, ml, tablet)" className="rounded-md border border-app-border bg-transparent px-3 py-2" required />
        </div>
      </div>

      <textarea {...register("instructions")} placeholder="Instructions (optional)" className="min-h-20 w-full rounded-md border border-app-border bg-transparent px-3 py-2" />

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Start date</span>
          <input type="date" {...register("startDate")} className="w-full rounded-md border border-app-border bg-transparent px-3 py-2" required />
        </label>
        <label className="space-y-1 text-sm">
          <span>End date</span>
          <input type="date" {...register("endDate")} className="w-full rounded-md border border-app-border bg-transparent px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Frequency</span>
          <select
            {...register("frequencyType")}
            value={frequencyType}
            onChange={(event) => {
              const next = event.target.value as MedicationFrequencyType;
              setFrequencyType(next);
              setSchedules([{ time: "08:00" }]);
            }}
            className="w-full rounded-md border border-app-border bg-transparent px-3 py-2"
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">Schedule</p>
        <ScheduleBuilder frequencyType={frequencyType} schedules={schedules} onChange={setSchedules} />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button type="submit" disabled={isSubmitting} className="rounded-md bg-app-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
        {isSubmitting ? "Saving..." : "Save medication"}
      </button>
    </form>
  );
}
