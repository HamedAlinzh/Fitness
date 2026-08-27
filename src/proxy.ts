import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";

/**
 * Public Server Actions carry a few form fields at most. `serverActions.bodySizeLimit` is
 * a single global figure, raised to 50MB so the admin gallery can take video, so without
 * this the two unauthenticated actions (`submitLead`, `submitTestimonial`) would accept a
 * 50MB body from anyone. Neither has rate limiting yet, so keeping their bodies small is
 * worth the few lines.
 */
const PUBLIC_BODY_LIMIT = 256 * 1024;

/**
 * Optimistic gate only: it checks that a session cookie is *present* and bounces
 * anonymous visitors to the login page before a page renders. It deliberately does not
 * verify the signature or hit the database — per the Next.js guidance, Proxy runs on
 * every matched request (including prefetches), so the real authorization check lives in
 * the Data Access Layer (`src/lib/auth/dal.ts`) that every admin page and action calls.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    if (request.method === "POST") {
      const declared = Number(request.headers.get("content-length") ?? 0);
      if (declared > PUBLIC_BODY_LIMIT) {
        return new NextResponse("Payload too large", { status: 413 });
      }
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // The public entries are the pages whose Server Actions post back to them.
  matcher: ["/admin/:path*", "/contact", "/testimonials"],
};
