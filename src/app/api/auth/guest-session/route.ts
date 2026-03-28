import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const GUEST_EMAIL = "guest@medivault.local";
const GUEST_FIREBASE_UID = "guest-local-account";
const GUEST_DISPLAY_NAME = "Guest User";
const GUEST_HOUSEHOLD_NAME = "Guest Household";

export async function POST() {
  const user = await prisma.user.upsert({
    where: { firebaseUid: GUEST_FIREBASE_UID },
    update: {
      email: GUEST_EMAIL,
      displayName: GUEST_DISPLAY_NAME,
      emailVerified: true,
      onboardingCompleted: true,
      lastLoginAt: new Date(),
    },
    create: {
      firebaseUid: GUEST_FIREBASE_UID,
      email: GUEST_EMAIL,
      displayName: GUEST_DISPLAY_NAME,
      emailVerified: true,
      onboardingCompleted: true,
      lastLoginAt: new Date(),
    },
  });

  const defaultMembership = await prisma.householdMember.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
    select: {
      householdId: true,
    },
  });

  const householdId = defaultMembership?.householdId ?? (await prisma.household.create({
    data: {
      name: GUEST_HOUSEHOLD_NAME,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
          isDefault: true,
        },
      },
    },
    select: {
      id: true,
    },
  })).id;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      primaryHouseholdId: householdId,
    },
  });

  const profileCount = await prisma.profile.count({
    where: {
      householdId,
    },
  });

  if (profileCount === 0) {
    await prisma.profile.create({
      data: {
        householdId,
        createdByUserId: user.id,
        linkedUserId: user.id,
        fullName: GUEST_DISPLAY_NAME,
        relation: "SELF",
        isPrimary: true,
      },
    });
  }

  await createSession(user.id);

  return NextResponse.json({ ok: true, guest: true });
}
