import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { requireSessionUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

const SELECTED_PROFILE_COOKIE = "medivault_selected_profile";
const PROFILE_COOKIE_AGE = 60 * 60 * 24 * 30;

type UpdateSelectedProfileBody = {
  profileId?: string;
};

export async function POST(request: NextRequest) {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as UpdateSelectedProfileBody;
  if (!body.profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const membership = await prisma.householdMember.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
    select: {
      householdId: true,
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "No default household found" }, { status: 400 });
  }

  const profile = await prisma.profile.findFirst({
    where: {
      id: body.profileId,
      householdId: membership.householdId,
    },
    select: {
      id: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Invalid profile" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SELECTED_PROFILE_COOKIE, profile.id, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: PROFILE_COOKIE_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
