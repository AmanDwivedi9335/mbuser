"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { createVital } from "@/features/vitals/services/vitals.client";
import { inferUnit } from "@/lib/utils/validations/vitals";
import type { VitalType } from "@/features/vitals/types/vitals.types";

type FormValues = {
  profileId: string;
  type: VitalType;
  value1: number;
  value2?: number;
  unit: string;
  recordedAt: string;
};

export function VitalForm({ profileId, type, onCreated }: { profileId: string; type: VitalType; onCreated: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultDateTime = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16), []);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>();

  if (!showForm) {
    return <button type="button" onClick={() => setShowForm(true)} className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">Add vital</button>;
  }

  return (
    <form
      className="grid gap-3 rounded-xl border border-app-border bg-app-panel p-4 md:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        setError(null);

        try {
          await createVital({
            ...values,
            type,
            unit: inferUnit(type),
            recordedAt: new Date(values.recordedAt).toISOString(),
          });
          reset({ profileId, type, value1: 0, value2: undefined, unit: inferUnit(type), recordedAt: defaultDateTime });
          setShowForm(false);
          onCreated();
        } catch (requestError: unknown) {
          setError(requestError instanceof Error ? requestError.message : "Unable to save vital");
        }
      })}
    >
      <input type="hidden" value={profileId} {...register("profileId")} />
      <input type="hidden" value={type} {...register("type")} />
      <input type="hidden" value={inferUnit(type)} {...register("unit")} />

      <label className="text-sm">
        {type === "BP" ? "Systolic" : "Value"}
        <input type="number" step="any" className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" {...register("value1", { valueAsNumber: true })} />
      </label>

      {type === "BP" ? (
        <label className="text-sm">
          Diastolic
          <input type="number" step="any" className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" {...register("value2", { valueAsNumber: true })} />
        </label>
      ) : <div />}

      <label className="text-sm md:col-span-2">
        Recorded at
        <input type="datetime-local" defaultValue={defaultDateTime} className="mt-1 w-full rounded-md border border-app-border bg-app-bg p-2" {...register("recordedAt")} />
      </label>

      <div className="md:col-span-2 flex gap-2">
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-app-accent px-4 py-2 text-sm text-white">{isSubmitting ? "Saving..." : "Save"}</button>
        <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-app-border px-4 py-2 text-sm">Cancel</button>
      </div>

      {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
