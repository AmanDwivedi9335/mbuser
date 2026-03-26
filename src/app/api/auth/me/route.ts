import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      householdMemberships: {
        where: { isDefault: true },
        include: {
          household: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const defaultMembership = user.householdMemberships[0];

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
      emailVerified: user.emailVerified,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
    },
    household: defaultMembership
      ? {
          id: defaultMembership.household.id,
          name: defaultMembership.household.name,
          timezone: defaultMembership.household.timezone,
          role: defaultMembership.role,
        }
      : null,
  });
}
