import { OnboardingStep, type Prisma, ProfileRelation } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type {
  FamilyMemberInput,
  OnboardingStatus,
  PrimaryProfileInput,
  SaveStepPayload,
} from "@/features/onboarding/types/onboarding.types";

function normalizeOnboardingStep(step: OnboardingStep): OnboardingStep {
  if (step === OnboardingStep.COMPLETED) {
    return OnboardingStep.REVIEW;
  }

  return step;
}

function parseFamilyMembers(raw: Prisma.JsonValue | null): FamilyMemberInput[] {
  if (!raw || !Array.isArray(raw)) {
    return [];
  }

  return raw as unknown as FamilyMemberInput[];
}

function parsePrimaryProfile(raw: Prisma.JsonValue | null): PrimaryProfileInput | null {
  if (!raw || Array.isArray(raw) || typeof raw !== "object") {
    return null;
  }

  return raw as unknown as PrimaryProfileInput;
}

export async function getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    completed: user.onboardingCompleted,
    step: user.onboardingCompleted ? OnboardingStep.COMPLETED : normalizeOnboardingStep(user.onboardingStep),
    household: user.onboardingHouseholdName ? { name: user.onboardingHouseholdName } : null,
    primaryProfile: parsePrimaryProfile(user.onboardingPrimaryProfile),
    familyMembers: parseFamilyMembers(user.onboardingFamilyMembers),
  };
}

export async function saveOnboardingStep(userId: string, payload: SaveStepPayload) {
  const data: Prisma.UserUpdateInput = {};

  if (payload.step === "HOUSEHOLD") {
    data.onboardingHouseholdName = payload.data.name;
    data.onboardingStep = OnboardingStep.PRIMARY_PROFILE;
  }

  if (payload.step === "PRIMARY_PROFILE") {
    data.onboardingPrimaryProfile = payload.data;
    data.onboardingStep = OnboardingStep.FAMILY_MEMBERS;
  }

  if (payload.step === "FAMILY_MEMBERS") {
    data.onboardingFamilyMembers = payload.data.members;
    data.onboardingStep = OnboardingStep.REVIEW;
  }

  await prisma.user.update({
    where: { id: userId },
    data,
  });

  return getOnboardingStatus(userId);
}

export async function completeOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.onboardingCompleted && user.primaryHouseholdId) {
    return { redirectTo: "/dashboard", completed: true };
  }

  const householdName = user.onboardingHouseholdName;
  const primaryProfile = parsePrimaryProfile(user.onboardingPrimaryProfile);
  const familyMembers = parseFamilyMembers(user.onboardingFamilyMembers);

  if (!householdName || !primaryProfile) {
    throw new Error("Missing required onboarding data");
  }

  await prisma.$transaction(async (tx) => {
    const existingMembership = await tx.householdMember.findFirst({
      where: { userId, isDefault: true },
      include: { household: true },
    });

    const household =
      existingMembership?.household ??
      (await tx.household.create({
        data: {
          name: householdName,
          ownerId: userId,
        },
      }));

    if (!existingMembership) {
      await tx.householdMember.create({
        data: {
          householdId: household.id,
          userId,
          role: "OWNER",
          isDefault: true,
        },
      });
    }

    const existingPrimary = await tx.profile.findFirst({
      where: {
        householdId: household.id,
        linkedUserId: userId,
        relation: ProfileRelation.SELF,
      },
    });

    if (!existingPrimary) {
      await tx.profile.create({
        data: {
          householdId: household.id,
          createdByUserId: userId,
          linkedUserId: userId,
          fullName: primaryProfile.fullName,
          relation: ProfileRelation.SELF,
          dateOfBirth: new Date(primaryProfile.dob),
          gender: primaryProfile.gender,
          bloodGroup: primaryProfile.bloodGroup ?? null,
          isPrimary: true,
        },
      });
    }

    for (const member of familyMembers) {
      const duplicate = await tx.profile.findFirst({
        where: {
          householdId: household.id,
          fullName: member.fullName,
          relation: member.relation,
        },
      });

      if (duplicate) {
        continue;
      }

      await tx.profile.create({
        data: {
          householdId: household.id,
          createdByUserId: userId,
          fullName: member.fullName,
          relation: member.relation,
          dateOfBirth: member.dob ? new Date(member.dob) : null,
          gender: member.gender ?? null,
          bloodGroup: member.bloodGroup ?? null,
          isPrimary: false,
        },
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: OnboardingStep.COMPLETED,
        primaryHouseholdId: household.id,
        onboardingHouseholdName: null,
        onboardingPrimaryProfile: Prisma.JsonNull,
        onboardingFamilyMembers: Prisma.JsonNull,
      },
    });
  });

  return { redirectTo: "/dashboard", completed: true };
}
