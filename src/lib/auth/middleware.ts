import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

const PUBLIC_API_ROUTES = new Set(["/api/auth/session", "/api/auth/logout"]);

export async function requireSessionMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/") && PUBLIC_API_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const session = await getSession();

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
