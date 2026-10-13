/**
 * Languages the public site is served in.
 *
 * Persian is the default and lives at the unprefixed URL (`/about`), so every link that
 * already exists keeps working; English lives under `/en` (`/en/about`). Internally both
 * are `app/[lang]/...` routes — `src/proxy.ts` rewrites the unprefixed URLs to `/fa/...`
 * without changing what the browser shows.
 *
 * Plain module (no server-only imports) because the navbar and the consultation form are
 * Client Components.
 */

export const LOCALES = ["fa", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

/** Cookie remembering an explicit choice, so `/` can honour it on the next visit. */
export const LOCALE_COOKIE = "lang";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dirOf(lang: Locale): "rtl" | "ltr" {
  return lang === "fa" ? "rtl" : "ltr";
}

/**
 * Prefixes a site-internal path with the language: `("en", "/about")` → `/en/about`,
 * `("fa", "/about")` → `/about`. The home page is `/` and `/en` (no trailing slash).
 */
export function localePath(lang: Locale, path: string): string {
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** The same page in the other language — what the navbar switcher links to. */
export function switchLocalePath(lang: Locale, path: string): string {
  return localePath(lang === "fa" ? "en" : "fa", path);
}

/**
 * Strips a leading language segment so a pathname can be re-prefixed for another
 * language. Handles `/fa` as well even though Persian is unprefixed in the browser,
 * because during server rendering the pathname can still be the internal rewritten one.
 */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Remember an explicit language choice so a later visit to `/` can honour it. */
export function rememberLocale(lang: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // Cookies blocked — the switch itself still works, it just isn't remembered.
  }
}
