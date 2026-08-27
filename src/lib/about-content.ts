import "server-only";
import { prisma } from "@/lib/prisma";
import { ABOUT_CONTENT_ID, ABOUT_DEFAULTS, type AboutContent } from "@/lib/about";

/**
 * Reads the single `AboutContent` row. Kept apart from `src/lib/about.ts` because that
 * module is imported by the admin form, a Client Component — pulling Prisma in there
 * drags the native SQLite driver into the browser bundle.
 *
 * Never throws and never returns partial content: a missing row, or a field that was
 * somehow emptied, falls back to the copy the site shipped with, so /about is never a
 * page of blank headings.
 */
export async function getAboutContent(): Promise<AboutContent> {
  const row = await prisma.aboutContent.findUnique({
    where: { id: ABOUT_CONTENT_ID },
  });

  if (!row) return ABOUT_DEFAULTS;

  return {
    eyebrow: row.eyebrow.trim() || ABOUT_DEFAULTS.eyebrow,
    heading: row.heading.trim() || ABOUT_DEFAULTS.heading,
    previewText: row.previewText.trim() || ABOUT_DEFAULTS.previewText,
    bodyText: row.bodyText.trim() || ABOUT_DEFAULTS.bodyText,
    image: row.image,
  };
}
