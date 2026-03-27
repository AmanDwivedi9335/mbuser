import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { requireSessionUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/db/prisma";

const SELECTED_PROFILE_COOKIE = "medivault_selected_profile";

export async function GET() {
  const user = await requireSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = await prisma.householdMember.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
    include: {
      household: {
        include: {
          profiles: {
            orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
            select: {
              id: true,
              fullName: true,
              relation: true,
              isPrimary: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ profiles: [], selectedProfileId: null });
  }

  const cookieStore = await cookies();
  const selectedProfileId = cookieStore.get(SELECTED_PROFILE_COOKIE)?.value ?? null;

  return NextResponse.json({
    profiles: membership.household.profiles,
    selectedProfileId,
  });
}
