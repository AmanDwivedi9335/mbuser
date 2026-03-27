import { redirect } from "next/navigation";

import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { requireSessionUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
