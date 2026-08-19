import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";

/**
 * Optimistic gate only: it checks that a session cookie is *present* and bounces
 * anonymous visitors to the login page before a page renders. It deliberately does not
 * verify the signature or hit the database — per the Next.js guidance, Proxy runs on
 * every matched request (including prefetches), so the real authorization check lives in
 * the Data Access Layer (`src/lib/auth/dal.ts`) that every admin page and action calls.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
