import { NextRequest, NextResponse } from "next/server";

import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { idToken?: string } | null;

  if (!body?.idToken) {
    return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
  }

  try {
    const decoded = await verifyFirebaseIdToken(body.idToken);
    const email = decoded.email?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Token is missing email." }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email,
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
        emailVerified: decoded.email_verified ?? false,
        lastLoginAt: new Date(),
      },
      create: {
        firebaseUid: decoded.uid,
        email,
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
        emailVerified: decoded.email_verified ?? false,
        lastLoginAt: new Date(),
      },
    });

    await createSession(user.id);

    return NextResponse.json({ ok: true, userId: user.id, onboardingCompleted: user.onboardingCompleted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed." },
      { status: 401 },
    );
  }
}
