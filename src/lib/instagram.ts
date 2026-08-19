export const INSTAGRAM_USERNAME = "pariasajadiyan";

export const INSTAGRAM_HANDLE = `@${INSTAGRAM_USERNAME}`;

export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

/**
 * Builds the canonical permalink for a post. Reels live under /reel/, images and
 * carousels under /p/ — Instagram redirects between them, but using the right
 * segment avoids a redirect hop.
 */
export function instagramPostUrl(shortcode: string, type: string) {
  const segment = type === "REEL" ? "reel" : "p";
  return `${INSTAGRAM_PROFILE_URL}${segment}/${shortcode}/`;
}
