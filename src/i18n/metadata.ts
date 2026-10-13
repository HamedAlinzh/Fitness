import type { Metadata } from "next";
import { pageTitle } from "@/lib/brand";
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from "./config";

/**
 * Absolute base for canonical and `hreflang` URLs. Set `SITE_URL` in production; the
 * localhost fallback only keeps `next build` quiet.
 */
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/**
 * Title, description, canonical URL and the `hreflang` pair for one page. `path` is the
 * unprefixed path (`/about`, `/` for home). Search engines use the alternates to send
 * English searchers to `/en/...` and Persian ones to the original URL.
 */
export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description }: { title: string; description: string }
): Metadata {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = localePath(locale, path);
  languages["x-default"] = localePath(DEFAULT_LOCALE, path);

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: localePath(lang, path), languages },
  };
}
