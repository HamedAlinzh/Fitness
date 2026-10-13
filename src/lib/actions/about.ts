"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import { ABOUT_CONTENT_ID, ABOUT_LIMITS } from "@/lib/about";

/**
 * Admin-only. Like every other action under the admin panel, each one calls
 * `requireAdmin()` itself — Server Actions are public HTTP endpoints and the layout is
 * not the security boundary (see CLAUDE.md).
 */

export type AboutState = { error?: string; success?: string } | undefined;

function revalidateAbout() {
  // The homepage preview and the /about page both read this row.
  revalidatePublicSite();
  revalidatePath("/admin/about");
}

export async function updateAboutContent(
  _prev: AboutState,
  formData: FormData
): Promise<AboutState> {
  await requireAdmin();

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const previewText = String(formData.get("previewText") ?? "").trim();
  // Textareas submit CRLF; storing LF keeps the paragraph splitting in
  // `aboutParagraphs` reading the same whatever the coach's browser sends.
  const bodyText = String(formData.get("bodyText") ?? "")
    .replace(/\r\n/g, "\n")
    .trim();

  // The form's maxLength/required attributes are a convenience, not a guarantee — an
  // action is reachable without the form at all.
  if (!eyebrow || !heading || !previewText || !bodyText) {
    return { error: "همه‌ی فیلدهای متنی را پر کن." };
  }
  if (
    eyebrow.length > ABOUT_LIMITS.eyebrow ||
    heading.length > ABOUT_LIMITS.heading ||
    previewText.length > ABOUT_LIMITS.previewText ||
    bodyText.length > ABOUT_LIMITS.bodyText
  ) {
    return { error: "یکی از متن‌ها از حد مجاز طولانی‌تر است." };
  }

  // English is optional — blank means "fall back to the Persian text".
  const english = {
    eyebrowEn: String(formData.get("eyebrowEn") ?? "").trim(),
    headingEn: String(formData.get("headingEn") ?? "").trim(),
    previewTextEn: String(formData.get("previewTextEn") ?? "").trim(),
    bodyTextEn: String(formData.get("bodyTextEn") ?? "")
      .replace(/\r\n/g, "\n")
      .trim(),
  };
  if (
    english.eyebrowEn.length > ABOUT_LIMITS.eyebrow ||
    english.headingEn.length > ABOUT_LIMITS.heading ||
    english.previewTextEn.length > ABOUT_LIMITS.previewText ||
    english.bodyTextEn.length > ABOUT_LIMITS.bodyText
  ) {
    return { error: "یکی از متن‌های انگلیسی از حد مجاز طولانی‌تر است." };
  }

  const existing = await prisma.aboutContent.findUnique({
    where: { id: ABOUT_CONTENT_ID },
  });

  // The file input is optional here: saving new text must not force re-picking a photo.
  const file = formData.get("image");
  let image = existing?.image ?? null;
  let replaced: string | null = null;

  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if (!saved.ok) return { error: saved.error };
    replaced = image;
    image = saved.url;
  }

  const data = { eyebrow, heading, previewText, bodyText, image, ...english };

  await prisma.aboutContent.upsert({
    where: { id: ABOUT_CONTENT_ID },
    update: data,
    create: { id: ABOUT_CONTENT_ID, ...data },
  });

  // Only after the row points at the new file, so a failure above can never leave the
  // section referencing a photo that no longer exists.
  await deleteUpload(replaced);

  revalidateAbout();
  return { success: "بخش «درباره من» به‌روزرسانی شد." };
}

/** Drops the photo and falls the section back to the gradient placeholder tile. */
export async function removeAboutImage() {
  await requireAdmin();

  const existing = await prisma.aboutContent.findUnique({
    where: { id: ABOUT_CONTENT_ID },
  });
  if (!existing?.image) return;

  await prisma.aboutContent.update({
    where: { id: ABOUT_CONTENT_ID },
    data: { image: null },
  });
  await deleteUpload(existing.image);

  revalidateAbout();
}
