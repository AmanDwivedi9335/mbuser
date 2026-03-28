import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { createSession } from "@/lib/auth/session";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function isMissingUserTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError
    && error.code === "P2021"
    && typeof error.meta?.table === "string"
    && error.meta.table.includes("User")
  );
}

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

    const { prisma } = await import("@/lib/db/prisma");

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
    if (isMissingUserTableError(error)) {
      return NextResponse.json(
        {
          error: "Database schema is not initialized. Run `npx prisma db push` (or your migration command) and restart the app.",
        },
        { status: 503 },
      );
    }

    const message = error instanceof Error ? error.message : "Authentication failed.";
    const status = message.includes("required") ? 500 : 401;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}
