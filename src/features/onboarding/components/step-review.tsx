"use client";

import type { FamilyMemberInput, HouseholdInput, PrimaryProfileInput } from "@/features/onboarding/types/onboarding.types";

type StepReviewProps = {
  household: HouseholdInput | null;
  primaryProfile: PrimaryProfileInput | null;
  familyMembers: FamilyMemberInput[];
  isSaving: boolean;
  onBack: () => void;
  onConfirm: () => Promise<void>;
};

export function StepReview({ household, primaryProfile, familyMembers, isSaving, onBack, onConfirm }: StepReviewProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold">Household</h3>
        <p className="mt-1 text-sm text-app-muted">{household?.name ?? "-"}</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold">Primary profile</h3>
        <p className="mt-1 text-sm text-app-muted">{primaryProfile?.fullName ?? "-"}</p>
        <p className="text-sm text-app-muted">DOB: {primaryProfile?.dob ?? "-"}</p>
        <p className="text-sm text-app-muted">Gender: {primaryProfile?.gender ?? "-"}</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold">Family members</h3>
        {familyMembers.length === 0 ? (
          <p className="mt-1 text-sm text-app-muted">No additional family members added.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-app-muted">
            {familyMembers.map((member) => (
              <li key={member.id}>
                {member.fullName} — {member.relation}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-4 py-2 font-semibold">Back</button>
        <button
          type="button"
          disabled={isSaving}
          className="rounded-lg bg-app-text px-4 py-2 font-semibold text-white disabled:opacity-60"
          onClick={() => void onConfirm()}
        >
          Confirm and continue
        </button>
      </div>
    </section>
  );
}
