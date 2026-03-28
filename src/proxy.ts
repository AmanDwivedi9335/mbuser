import { NextRequest } from "next/server";

import { requireSessionMiddleware } from "@/lib/auth/middleware";

export function proxy(request: NextRequest) {
  return requireSessionMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/api/:path*"],
};
