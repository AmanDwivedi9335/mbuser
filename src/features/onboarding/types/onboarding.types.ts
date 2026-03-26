export type OnboardingStep = "HOUSEHOLD" | "PRIMARY_PROFILE" | "FAMILY_MEMBERS" | "REVIEW" | "COMPLETED";
export type OnboardingStepKey = Exclude<OnboardingStep, "COMPLETED">;

export type ProfileGender = "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | "PREFER_NOT_TO_SAY";
export type ProfileRelation = "SELF" | "SPOUSE" | "SON" | "DAUGHTER" | "FATHER" | "MOTHER" | "GRANDPARENT" | "OTHER";

export type HouseholdInput = {
  name: string;
};

export type PrimaryProfileInput = {
  fullName: string;
  relation: "SELF";
  dob: string;
  gender: ProfileGender;
  bloodGroup?: string | null;
};

export type FamilyMemberInput = {
  id: string;
  fullName: string;
  relation: Exclude<ProfileRelation, "SELF">;
  dob?: string | null;
  gender?: ProfileGender | null;
  bloodGroup?: string | null;
};

export type OnboardingStatus = {
  completed: boolean;
  step: OnboardingStep;
  household: HouseholdInput | null;
  primaryProfile: PrimaryProfileInput | null;
  familyMembers: FamilyMemberInput[];
};

export type SaveStepPayload =
  | { step: "HOUSEHOLD"; data: HouseholdInput }
  | { step: "PRIMARY_PROFILE"; data: PrimaryProfileInput }
  | { step: "FAMILY_MEMBERS"; data: { members: FamilyMemberInput[] } };
