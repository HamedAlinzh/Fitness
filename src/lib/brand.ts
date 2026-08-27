/**
 * The site's name, in one place.
 *
 * It used to be hard-coded into the navbar, the footer and every page's `metadata`
 * title, which meant a rebrand was a ten-file search-and-replace with no way to tell
 * whether one had been missed. Page titles go through `pageTitle` for the same reason.
 */

export const SITE_NAME = "Train With Paria";

/** The single character inside the round logo mark next to the name. */
export const SITE_LOGO_MARK = "P";

/**
 * The logo emblem (the barbell figure, without the "TRAIN WITH PARIA" wordmark that is
 * part of the artwork) shown next to the name in the header.
 *
 * The coach supplied `public/Logo.jpeg`, which is the full logo *and* has the editor's
 * transparency checkerboard baked into it as real grey squares — dropped into a page it
 * renders a chequered rectangle. `public/logo-mark.png` is that file with the
 * checkerboard turned back into an alpha channel and the wordmark cropped off, since the
 * name is already printed next to it as text and would otherwise appear twice.
 *
 * The intrinsic size is exported because `next/image` requires width/height for a
 * non-imported `src`, and it is what reserves the space so the header doesn't reflow.
 */
export const SITE_LOGO_SRC = "/logo-mark.png";
export const SITE_LOGO_WIDTH = 868;
export const SITE_LOGO_HEIGHT = 527;

export const SITE_TAGLINE =
  "مربیگری تخصصی بدنسازی و تناسب اندام، به‌صورت حضوری در شیراز و آنلاین در سراسر ایران.";

/** `"گالری" → "گالری | train with paria"`. */
export function pageTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}
