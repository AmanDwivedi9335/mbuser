export type DashboardUser = {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  onboardingStep: string;
};

export type DashboardHousehold = {
  id: string;
  name: string;
  timezone: string;
  role: string;
};

export type CurrentUserResponse = {
  user: DashboardUser;
  household: DashboardHousehold | null;
};

export type DashboardProfile = {
  id: string;
  fullName: string;
  relation: string;
  isPrimary: boolean;
};

export type DashboardProfilesResponse = {
  profiles: DashboardProfile[];
  selectedProfileId: string | null;
};
