import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/i18n/config";

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
 *
 * ## Languages
 *
 * The public site is `app/[lang]/...`. Persian is served at the unprefixed URL, so a
 * request for `/about` is *rewritten* to `/fa/about` (the browser keeps seeing `/about`),
 * while `/en/...` is already a real route and passes straight through. A literal `/fa/...`
 * is redirected to the unprefixed URL so each Persian page has exactly one address.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    if (!request.cookies.get(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    return NextResponse.next();
  }

  if (request.method === "POST") {
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > PUBLIC_BODY_LIMIT) {
      return new NextResponse("Payload too large", { status: 413 });
    }
  }

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // A visitor who explicitly chose English last time lands on the English home page.
  // Only `/` is redirected: a deep link to a Persian page is a deliberate choice.
  if (
    pathname === "/" &&
    request.method === "GET" &&
    request.cookies.get(LOCALE_COOKIE)?.value === "en"
  ) {
    return NextResponse.redirect(new URL("/en", request.nextUrl));
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fa${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, the file routes that live outside `[lang]`
  // (`/uploads`, `/px`) and anything with a file extension (public assets, favicon).
  matcher: ["/((?!_next/|uploads/|px$|.*\\..*).*)"],
};
