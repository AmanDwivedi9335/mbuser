"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ProgressHeader } from "@/features/onboarding/components/progress-header";
import { StepFamilyMembers } from "@/features/onboarding/components/step-family-members";
import { StepHousehold } from "@/features/onboarding/components/step-household";
import { StepPrimaryProfile } from "@/features/onboarding/components/step-primary-profile";
import { StepReview } from "@/features/onboarding/components/step-review";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import type { OnboardingStepKey } from "@/features/onboarding/types/onboarding.types";

const STEP_ORDER: OnboardingStepKey[] = ["HOUSEHOLD", "PRIMARY_PROFILE", "FAMILY_MEMBERS", "REVIEW"];

export function OnboardingShell() {
  const router = useRouter();
  const { status, activeStep, isLoading, isSaving, error, saveStep, complete } = useOnboarding();
  const [currentStep, setCurrentStep] = useState<OnboardingStepKey>("HOUSEHOLD");

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  const progress = useMemo(() => {
    const index = STEP_ORDER.indexOf(currentStep);
    return ((index + 1) / STEP_ORDER.length) * 100;
  }, [currentStep]);

  const goBack = () => {
    const index = STEP_ORDER.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(STEP_ORDER[index - 1]);
    }
  };

  const handleComplete = async () => {
    const result = await complete();
    router.push(result.redirectTo);
    router.refresh();
  };

  if (isLoading || !status) {
    return <p className="text-sm text-app-muted">Loading onboarding...</p>;
  }

  if (status.completed) {
    router.push("/dashboard");
    return null;
  }

  return (
    <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl shadow-fuchsia-200/30 sm:p-8">
      <h1 className="text-2xl font-bold text-app-text">Welcome to Medivault</h1>
      <p className="mt-1 text-sm text-app-muted">Set up your household and profiles to get started.</p>

      <ProgressHeader step={currentStep} progress={progress} />

      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

      {currentStep === "HOUSEHOLD" ? (
        <StepHousehold
          defaultValues={status.household}
          isSaving={isSaving}
          onNext={async (values) => {
            await saveStep({ step: "HOUSEHOLD", data: values });
            setCurrentStep("PRIMARY_PROFILE");
          }}
        />
      ) : null}

      {currentStep === "PRIMARY_PROFILE" ? (
        <StepPrimaryProfile
          defaultValues={status.primaryProfile}
          isSaving={isSaving}
          onBack={goBack}
          onNext={async (values) => {
            await saveStep({ step: "PRIMARY_PROFILE", data: values });
            setCurrentStep("FAMILY_MEMBERS");
          }}
        />
      ) : null}

      {currentStep === "FAMILY_MEMBERS" ? (
        <StepFamilyMembers
          defaultValues={status.familyMembers}
          isSaving={isSaving}
          onBack={goBack}
          onNext={async (values) => {
            await saveStep({ step: "FAMILY_MEMBERS", data: values });
            setCurrentStep("REVIEW");
          }}
        />
      ) : null}

      {currentStep === "REVIEW" ? (
        <StepReview
          household={status.household}
          primaryProfile={status.primaryProfile}
          familyMembers={status.familyMembers}
          isSaving={isSaving}
          onBack={goBack}
          onConfirm={handleComplete}
        />
      ) : null}
    </section>
  );
}
