"use client";

import { useForm } from "react-hook-form";

import { primaryProfileSchema, type PrimaryProfileSchemaInput } from "@/features/onboarding/schemas/primary-profile.schema";
import type { PrimaryProfileInput } from "@/features/onboarding/types/onboarding.types";

type StepPrimaryProfileProps = {
  defaultValues?: PrimaryProfileInput | null;
  isSaving: boolean;
  onBack: () => void;
  onNext: (values: PrimaryProfileInput) => Promise<void>;
};

export function StepPrimaryProfile({ defaultValues, isSaving, onBack, onNext }: StepPrimaryProfileProps) {
  const form = useForm<PrimaryProfileSchemaInput>({
    defaultValues: defaultValues ?? {
      fullName: "",
      relation: "SELF",
      dob: "",
      gender: "PREFER_NOT_TO_SAY",
      bloodGroup: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    const parsed = primaryProfileSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PrimaryProfileSchemaInput;
        form.setError(field, { message: issue.message });
      });
      return;
    }

    await onNext(parsed.data);
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label htmlFor="primaryName" className="mb-1 block text-sm font-medium text-app-text">Full name</label>
        <input id="primaryName" className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register("fullName")} />
        <p className="mt-1 text-sm text-red-600">{form.formState.errors.fullName?.message}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="primaryDob" className="mb-1 block text-sm font-medium text-app-text">Date of birth</label>
          <input id="primaryDob" type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register("dob")} />
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.dob?.message}</p>
        </div>

        <div>
          <label htmlFor="primaryGender" className="mb-1 block text-sm font-medium text-app-text">Gender</label>
          <select id="primaryGender" className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register("gender")}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="primaryBlood" className="mb-1 block text-sm font-medium text-app-text">Blood group (optional)</label>
        <input id="primaryBlood" placeholder="A+" className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register("bloodGroup")} />
        <p className="mt-1 text-sm text-red-600">{form.formState.errors.bloodGroup?.message}</p>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-brand rounded-lg px-4 py-2 font-semibold">Back</button>
        <button type="submit" disabled={isSaving} className="btn-brand rounded-lg px-4 py-2 font-semibold">Continue</button>
      </div>
    </form>
  );
}
