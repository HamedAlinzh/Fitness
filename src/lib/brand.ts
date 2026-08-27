/**
 * The site's name, in one place.
 *
 * It used to be hard-coded into the navbar, the footer and every page's `metadata`
 * title, which meant a rebrand was a ten-file search-and-replace with no way to tell
 * whether one had been missed. Page titles go through `pageTitle` for the same reason.
 */

export const SITE_NAME = "train with paria";

/** The single character inside the round logo mark next to the name. */
export const SITE_LOGO_MARK = "P";

export const SITE_TAGLINE =
  "مربیگری تخصصی بدنسازی و تناسب اندام، به‌صورت حضوری در شیراز و آنلاین در سراسر ایران.";

/** `"گالری" → "گالری | train with paria"`. */
export function pageTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}
