import { redirect } from "next/navigation";

import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { requireSessionUser } from "@/lib/auth/require-user";

export default async function OnboardingPage() {
  const user = await requireSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <OnboardingShell />;
}
