import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function requireSessionUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}
