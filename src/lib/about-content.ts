import "server-only";
import { prisma } from "@/lib/prisma";
import {
  ABOUT_CONTENT_ID,
  ABOUT_DEFAULTS,
  ABOUT_DEFAULTS_EN,
  ABOUT_TEXT_KEYS,
  type AboutContent,
  type AboutEditable,
} from "@/lib/about";
import type { Locale } from "@/i18n/config";

/**
 * Reads the single `AboutContent` row. Kept apart from `src/lib/about.ts` because that
 * module is imported by the admin form, a Client Component — pulling Prisma in there
 * drags the native SQLite driver into the browser bundle.
 *
 * Never throws and never returns partial content: a missing row, or a field that was
 * somehow emptied, falls back to the copy the site shipped with, so /about is never a
 * page of blank headings.
 *
 * For English, a field uses the coach's English text when there is some. When there is
 * none, it falls back to the *Persian* text — except while that Persian text is still the
 * shipped default, in which case the shipped English default is used, so an untouched
 * site reads properly in both languages instead of showing English visitors an
 * untranslated paragraph that was never customised.
 */
export async function getAboutContent(lang: Locale = "fa"): Promise<AboutContent> {
  const editable = await getAboutEditable();

  if (lang === "fa") {
    return {
      eyebrow: editable.eyebrow,
      heading: editable.heading,
      previewText: editable.previewText,
      bodyText: editable.bodyText,
      image: editable.image,
    };
  }

  const english = { ...ABOUT_DEFAULTS_EN, image: editable.image };
  for (const key of ABOUT_TEXT_KEYS) {
    const own = editable[`${key}En`].trim();
    const persian = editable[key];
    english[key] = own || (persian === ABOUT_DEFAULTS[key] ? ABOUT_DEFAULTS_EN[key] : persian);
  }
  return english;
}

/** Both languages of every field — what the admin form edits. */
export async function getAboutEditable(): Promise<AboutEditable> {
  const row = await prisma.aboutContent.findUnique({
    where: { id: ABOUT_CONTENT_ID },
  });

  return {
    eyebrow: row?.eyebrow.trim() || ABOUT_DEFAULTS.eyebrow,
    heading: row?.heading.trim() || ABOUT_DEFAULTS.heading,
    previewText: row?.previewText.trim() || ABOUT_DEFAULTS.previewText,
    bodyText: row?.bodyText.trim() || ABOUT_DEFAULTS.bodyText,
    image: row?.image ?? null,
    eyebrowEn: row?.eyebrowEn ?? "",
    headingEn: row?.headingEn ?? "",
    previewTextEn: row?.previewTextEn ?? "",
    bodyTextEn: row?.bodyTextEn ?? "",
  };
}
