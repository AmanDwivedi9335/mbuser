"use client";

import { useForm } from "react-hook-form";

import { householdSchema, type HouseholdSchemaInput } from "@/features/onboarding/schemas/household.schema";
import type { HouseholdInput } from "@/features/onboarding/types/onboarding.types";

type StepHouseholdProps = {
  defaultValues?: HouseholdInput | null;
  isSaving: boolean;
  onNext: (values: HouseholdInput) => Promise<void>;
};

export function StepHousehold({ defaultValues, isSaving, onNext }: StepHouseholdProps) {
  const form = useForm<HouseholdSchemaInput>({
    defaultValues: defaultValues ?? { name: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    const parsed = householdSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof HouseholdSchemaInput;
        form.setError(field, { message: issue.message });
      });
      return;
    }

    await onNext(parsed.data);
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label htmlFor="householdName" className="mb-1 block text-sm font-medium text-app-text">
          Household name
        </label>
        <input
          id="householdName"
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Sharma Family"
          {...form.register("name")}
        />
        <p className="mt-1 text-sm text-red-600">{form.formState.errors.name?.message}</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-app-text px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
