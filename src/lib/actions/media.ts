"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteUpload, saveUpload } from "@/lib/uploads";

export type MediaState = { error?: string; success?: string } | undefined;

function revalidateGallery() {
  revalidatePath("/admin/media");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function uploadGalleryItem(
  _prev: MediaState,
  formData: FormData
): Promise<MediaState> {
  await requireAdmin();

  const caption = String(formData.get("caption") ?? "").trim();
  const type = String(formData.get("type") ?? "IMAGE");
  const file = formData.get("file");

  if (!caption) return { error: "برای تصویر یک عنوان بنویسید." };
  if (!(file instanceof File)) return { error: "فایلی انتخاب نشده است." };
  if (type !== "IMAGE" && type !== "VIDEO") return { error: "نوع نامعتبر است." };

  const saved = await saveUpload(file);
  if (!saved.ok) return { error: saved.error };

  await prisma.galleryItem.create({
    data: { caption, type, url: saved.url },
  });

  revalidateGallery();
  return { success: "تصویر با موفقیت اضافه شد." };
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

  const saved = await saveUpload(file);
  if (!saved.ok) return { error: saved.error };

  await prisma.galleryItem.update({
    where: { id },
    data: { url: saved.url },
  });

  // Only remove the old file once the row points at the new one, so a failure above
  // can never leave the gallery referencing a file that no longer exists.
  await deleteUpload(existing.url);

  revalidateGallery();
  return { success: "تصویر جایگزین شد." };
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
}

export async function updateGalleryCaption(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  if (!id || !caption) return;

  await prisma.galleryItem.update({ where: { id }, data: { caption } });
  revalidateGallery();
}
