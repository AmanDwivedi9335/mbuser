import type { OnboardingStepKey } from "@/features/onboarding/types/onboarding.types";

const LABELS: Record<OnboardingStepKey, string> = {
  HOUSEHOLD: "Household",
  PRIMARY_PROFILE: "Primary Profile",
  FAMILY_MEMBERS: "Family Members",
  REVIEW: "Review",
};

type ProgressHeaderProps = {
  step: OnboardingStepKey;
  progress: number;
};

export function ProgressHeader({ step, progress }: ProgressHeaderProps) {
  return (
    <header className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-app-muted">Step: {LABELS[step]}</p>
        <p className="text-sm font-semibold text-app-text">{Math.round(progress)}%</p>
      </div>
      <div className="h-2 w-full rounded-full bg-fuchsia-100">
        <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
