"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteUpload, prepareUpload, writeUpload } from "@/lib/uploads";
import { DUPLICATE_WINDOW_MS, type MediaNoticeCode } from "@/lib/media";

export type MediaState = { error?: string } | undefined;

function revalidateGallery() {
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  revalidatePath("/");
}

/**
 * Ends a successful action with a redirect instead of a returned value.
 *
 * Without this the browser is left sitting on the POST that performed the upload, and a
 * refresh — a pull-to-refresh on iOS in particular, which is exactly what someone does
 * when a page seems stuck — re-sends it and adds the photo a second time. This is the
 * same Post/Redirect/Get shape the blog actions already use.
 *
 * The nonce matters: two identical outcomes in a row would otherwise produce the same URL,
 * and the page (and with it the upload form) would not re-render to clear itself.
 */
function finish(code: MediaNoticeCode): never {
  redirect(`/admin/media?ok=${code}&n=${randomUUID().slice(0, 8)}`);
}

export async function uploadGalleryItem(
  _prev: MediaState,
  formData: FormData
): Promise<MediaState> {
  await requireAdmin();

  const caption = String(formData.get("caption") ?? "").trim();
  const file = formData.get("file");

  if (!caption) return { error: "برای این مورد یک عنوان بنویسید." };
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };

  const prepared = await prepareUpload(file, { allowVideo: true });
  if (!prepared.ok) return { error: prepared.error };

  // Recognise the same bytes under the same caption as an accidental repeat. Checked
  // before the file is written, so a duplicate leaves nothing behind in public/uploads/.
  const duplicate = await prisma.galleryItem.findFirst({
    where: {
      fileHash: prepared.hash,
      caption,
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    },
    select: { id: true },
  });
  if (duplicate) finish("duplicate");

  const url = await writeUpload(prepared);

  // The kind comes from the sniffed bytes, not from a dropdown the coach could get wrong:
  // the form used to let you file a JPEG as "ویدیو", which stored an image wearing a play
  // badge.
  await prisma.galleryItem.create({
    data: { caption, type: prepared.kind, url, fileHash: prepared.hash },
  });

  revalidateGallery();
  finish("uploaded");
}

export async function replaceGalleryImage(
  _prev: MediaState,
  formData: FormData
): Promise<MediaState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");

  if (!id) return { error: "شناسه نامعتبر است." };
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return { error: "این تصویر پیدا نشد." };

  const prepared = await prepareUpload(file, { allowVideo: true });
  if (!prepared.ok) return { error: prepared.error };

  // Replacing a photo with the identical photo is a repeat submission, not a change.
  if (existing.fileHash && existing.fileHash === prepared.hash) finish("unchanged");

  const url = await writeUpload(prepared);

  await prisma.galleryItem.update({
    where: { id },
    // The kind follows the new file: swapping a photo for a clip has to update both.
    data: { url, type: prepared.kind, fileHash: prepared.hash },
  });

  // Only remove the old file once the row points at the new one, so a failure above
  // can never leave the gallery referencing a file that no longer exists.
  await deleteUpload(existing.url);

  revalidateGallery();
  finish("replaced");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.galleryItem.delete({ where: { id } });
  await deleteUpload(existing.url);

  revalidateGallery();
  finish("deleted");
}

export async function updateGalleryCaption(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  if (!id || !caption) return;

  await prisma.galleryItem.update({ where: { id }, data: { caption } });

  revalidateGallery();
  finish("caption");
}
