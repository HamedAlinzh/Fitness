/**
 * The Instagram account and the shape of a post link.
 *
 * See CLAUDE.md for why the feed is DB-backed cards linking out, rather than Instagram's
 * official embed: Instagram is blocked in Iran and Meta blocks Iranian IPs, so an
 * official embed renders as an empty box for most of this site's audience — and post
 * metadata can't be fetched either, which is why the screenshot is uploaded by hand from
 * /admin/instagram.
 */

export const INSTAGRAM_USERNAME = "trainwithparia";

export const INSTAGRAM_HANDLE = `@${INSTAGRAM_USERNAME}`;

export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

/**
 * How many posts the homepage section shows. Adding a post from the admin panel trims
 * the feed back to this many, so the oldest one drops off — the section is a rolling
 * window on the newest posts, not an archive.
 */
export const INSTAGRAM_FEED_SIZE = 6;

/** type: "REEL" | "POST" — mirrors the /reel/ vs /p/ segment of the permalink. */
export type InstagramPostType = "REEL" | "POST";

export const INSTAGRAM_TYPE_LABELS: Record<InstagramPostType, string> = {
  REEL: "ریلز",
  POST: "پست",
};

/**
 * Builds the canonical permalink for a post. Reels live under /reel/, images and
 * carousels under /p/ — Instagram redirects between them, but using the right
 * segment avoids a redirect hop.
 */
export function instagramPostUrl(shortcode: string, type: string) {
  const segment = type === "REEL" ? "reel" : "p";
  return `${INSTAGRAM_PROFILE_URL}${segment}/${shortcode}/`;
}

export type ParsedPostLink =
  | { ok: true; shortcode: string; type: InstagramPostType }
  | { ok: false; reason: "empty" | "not-instagram" | "share-link" | "no-shortcode" };

// Instagram shortcodes are base64url-ish and currently 11 characters, but the length has
// changed before, so only the alphabet is pinned.
const SHORTCODE = /^[A-Za-z0-9_-]{5,30}$/;

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
  "instagr.am",
  "www.instagr.am",
]);

/**
 * Pulls the shortcode and post type out of a link the coach copied from Instagram.
 *
 * Accepts every form the app hands out — `/p/<code>/`, `/reel/<code>/`, `/reels/<code>/`,
 * the legacy `/tv/<code>/`, and any of those behind a `/<username>/` prefix — with or
 * without `https://`, `www.`, a trailing slash, or the `?igsh=…` tracking parameter
 * Instagram appends to shared links.
 *
 * `/share/…` links are rejected on purpose. They carry no shortcode and only resolve by
 * following a redirect, which this server cannot do: Meta blocks Iranian IPs, so the
 * request from the VPS would hang or fail rather than resolve. Telling the coach to copy
 * the address bar URL instead is the honest outcome.
 */
export function parseInstagramPostUrl(input: string): ParsedPostLink {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: "empty" };

  let url: URL;
  try {
    // A pasted link often lacks the protocol; assume https rather than rejecting it.
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "not-instagram" };
  }

  if (!INSTAGRAM_HOSTS.has(url.hostname.toLowerCase())) {
    return { ok: false, reason: "not-instagram" };
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0]?.toLowerCase() === "share") {
    return { ok: false, reason: "share-link" };
  }

  // The kind segment is either first, or second when the username is in the path.
  const kindIndex = segments.findIndex((segment) =>
    ["p", "reel", "reels", "tv"].includes(segment.toLowerCase())
  );
  if (kindIndex === -1) return { ok: false, reason: "no-shortcode" };

  const kind = segments[kindIndex].toLowerCase();
  const shortcode = segments[kindIndex + 1];
  if (!shortcode || !SHORTCODE.test(shortcode)) {
    return { ok: false, reason: "no-shortcode" };
  }

  return {
    ok: true,
    shortcode,
    // IGTV was folded into reels, but old /tv/ links still resolve as regular posts.
    type: kind === "reel" || kind === "reels" ? "REEL" : "POST",
  };
}
