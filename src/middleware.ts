import { NextRequest } from "next/server";

import { requireSessionMiddleware } from "@/lib/auth/middleware";

export function middleware(request: NextRequest) {
  return requireSessionMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
