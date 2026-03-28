"use client";

import { useFieldArray, useForm } from "react-hook-form";

import { familyMembersSchema, type FamilyMembersSchemaInput } from "@/features/onboarding/schemas/family-members.schema";
import type { FamilyMemberInput } from "@/features/onboarding/types/onboarding.types";

type StepFamilyMembersProps = {
  defaultValues: FamilyMemberInput[];
  isSaving: boolean;
  onBack: () => void;
  onNext: (values: { members: FamilyMemberInput[] }) => Promise<void>;
};

export function StepFamilyMembers({ defaultValues, isSaving, onBack, onNext }: StepFamilyMembersProps) {
  const form = useForm<FamilyMembersSchemaInput>({
    defaultValues: {
      members: defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const submit = form.handleSubmit(async (values) => {
    const parsed = familyMembersSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".") as
          | `members.${number}.fullName`
          | `members.${number}.relation`
          | `members.${number}.dob`
          | `members.${number}.bloodGroup`;
        form.setError(fieldName, { message: issue.message });
      });
      return;
    }

    await onNext(parsed.data);
  });

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <input type="hidden" {...form.register(`members.${index}.id`)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-app-text">Full name</label>
                <input className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register(`members.${index}.fullName`)} />
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.members?.[index]?.fullName?.message}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-app-text">Relation</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register(`members.${index}.relation`)}>
                  <option value="SPOUSE">Spouse</option>
                  <option value="SON">Son</option>
                  <option value="DAUGHTER">Daughter</option>
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GRANDPARENT">Grandparent</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-app-text">Date of birth (optional)</label>
                <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register(`members.${index}.dob`)} />
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.members?.[index]?.dob?.message}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-app-text">Gender (optional)</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2" {...form.register(`members.${index}.gender`)}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non-binary</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-app-text">Blood group (optional)</label>
                <input className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="O+" {...form.register(`members.${index}.bloodGroup`)} />
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.members?.[index]?.bloodGroup?.message}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button type="button" className="text-sm font-semibold text-red-600" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-brand rounded-lg px-4 py-2 text-sm font-semibold"
        onClick={() => append({ id: crypto.randomUUID(), fullName: "", relation: "SPOUSE", dob: "", gender: "", bloodGroup: "" })}
      >
        Add family member
      </button>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-brand rounded-lg px-4 py-2 font-semibold">Back</button>
        <button type="submit" disabled={isSaving} className="btn-brand rounded-lg px-4 py-2 font-semibold">Continue</button>
      </div>
    </form>
  );
}
