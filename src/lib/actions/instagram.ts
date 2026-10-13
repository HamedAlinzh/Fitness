"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import {
  INSTAGRAM_FEED_SIZE,
  INSTAGRAM_TYPE_LABELS,
  parseInstagramPostUrl,
} from "@/lib/instagram";

/**
 * Admin-only. Like every other action under the admin panel, each one calls
 * `requireAdmin()` itself — Server Actions are public HTTP endpoints and the layout is
 * not the security boundary (see CLAUDE.md).
 */

export type InstagramState = { error?: string; success?: string } | undefined;

function revalidateFeed() {
  // The section only appears on the homepage.
  revalidatePublicSite();
  revalidatePath("/admin/instagram");
}

const LINK_ERRORS: Record<string, string> = {
  empty: "لینک پست را وارد کن.",
  "not-instagram": "این لینک اینستاگرام نیست.",
  "share-link":
    "لینک‌های «share» شامل کد پست نیستند. پست را در اینستاگرام باز کن و نشانی نوار آدرس را کپی کن.",
  "no-shortcode":
    "این لینک به یک پست مشخص اشاره نمی‌کند. نشانی خود پست یا ریلز را کپی کن.",
};

/**
 * Puts the post at the front of the feed and trims the tail.
 *
 * The whole ordering is rewritten to 0…n-1 on every change rather than nudged, so the
 * `sortOrder` column can't drift into gaps or duplicates over time. Anything past
 * `INSTAGRAM_FEED_SIZE` is deleted along with its uploaded screenshot — the section is a
 * rolling window on the newest posts, so a row that can never be shown again would only
 * leave an orphaned file behind in public/uploads/.
 *
 * Returns the posts that fell off, for the confirmation message.
 */
async function promoteAndTrim(id: string) {
  const posts = await prisma.instagramPost.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, shortcode: true, thumbnail: true },
  });

  const promoted = [
    ...posts.filter((post) => post.id === id),
    ...posts.filter((post) => post.id !== id),
  ];

  const kept = promoted.slice(0, INSTAGRAM_FEED_SIZE);
  const dropped = promoted.slice(INSTAGRAM_FEED_SIZE);

  await prisma.$transaction([
    ...kept.map((post, index) =>
      prisma.instagramPost.update({
        where: { id: post.id },
        data: { sortOrder: index },
      })
    ),
    ...dropped.map((post) =>
      prisma.instagramPost.delete({ where: { id: post.id } })
    ),
  ]);

  // Only once the rows are gone. `deleteUpload` ignores anything outside /uploads/, so
  // the repo-shipped /instagram/*.jpg covers of the seeded posts are left alone.
  for (const post of dropped) await deleteUpload(post.thumbnail);

  return dropped;
}

export async function addInstagramPost(
  _prev: InstagramState,
  formData: FormData
): Promise<InstagramState> {
  await requireAdmin();

  const parsed = parseInstagramPostUrl(String(formData.get("url") ?? ""));
  if (!parsed.ok) return { error: LINK_ERRORS[parsed.reason] };

  const file = formData.get("screenshot");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "یک اسکرین‌شات از پست انتخاب کن." };
  }

  const saved = await saveUpload(file);
  if (!saved.ok) return { error: saved.error };

  // `shortcode` is unique. Re-adding a post the coach already has replaces its
  // screenshot and moves it back to the front rather than failing on the constraint.
  const existing = await prisma.instagramPost.findUnique({
    where: { shortcode: parsed.shortcode },
    select: { id: true, thumbnail: true },
  });

  const post = existing
    ? await prisma.instagramPost.update({
        where: { id: existing.id },
        data: { type: parsed.type, thumbnail: saved.url },
      })
    : await prisma.instagramPost.create({
        data: {
          shortcode: parsed.shortcode,
          type: parsed.type,
          thumbnail: saved.url,
          // promoteAndTrim rewrites this immediately; -1 only guarantees it sorts first.
          sortOrder: -1,
        },
      });

  if (existing) await deleteUpload(existing.thumbnail);

  const dropped = await promoteAndTrim(post.id);
  revalidateFeed();

  const label = INSTAGRAM_TYPE_LABELS[parsed.type];
  return {
    success: existing
      ? `این ${label} از قبل بود؛ اسکرین‌شاتش عوض شد و به ابتدای لیست آمد.`
      : dropped.length > 0
        ? `${label} جدید اضافه شد و قدیمی‌ترین پست (${dropped
            .map((post) => post.shortcode)
            .join("، ")}) از صفحه‌ی اصلی حذف شد.`
        : `${label} جدید اضافه شد.`,
  };
}

export async function deleteInstagramPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await prisma.instagramPost.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.instagramPost.delete({ where: { id } });
  await deleteUpload(existing.thumbnail);

  // Close the gap the deletion left in the ordering.
  const rest = await prisma.instagramPost.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  await prisma.$transaction(
    rest.map((post, index) =>
      prisma.instagramPost.update({
        where: { id: post.id },
        data: { sortOrder: index },
      })
    )
  );

  revalidateFeed();
}
