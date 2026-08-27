import { recordPageView } from "@/lib/analytics";

/**
 * The visit counter: a 1×1 transparent GIF requested by `<ViewPixel />` in the public
 * layout. See src/lib/analytics.ts for why counting is first-party and why it's an image
 * rather than a script.
 *
 * The page being counted is taken from the `Referer` header the browser sends with the
 * image request, which is what lets the pixel's own URL stay constant — every public
 * page can keep its static HTML, and nothing about it depends on JavaScript running.
 */

// Never prerendered and never cached: it must run on every single request.
export const dynamic = "force-dynamic";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: Request) {
  await recordPageView(request);

  return new Response(new Uint8Array(TRANSPARENT_GIF), {
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(TRANSPARENT_GIF.byteLength),
      // Without this the browser serves the pixel from its own cache on the second page
      // and every visit after the first would go uncounted.
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "X-Robots-Tag": "noindex",
    },
  });
}
