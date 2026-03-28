import { NextRequest, NextResponse } from "next/server";

const PUBLIC_API_ROUTES = new Set(["/api/auth/session", "/api/auth/guest-session", "/api/auth/logout"]);
const SESSION_COOKIE_NAME = "medivault_session";

export async function requireSessionMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/") && PUBLIC_API_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
