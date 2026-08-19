"use client";

import { useActionState } from "react";
import { Repeat, Trash2, Save, AlertCircle } from "lucide-react";
import GalleryTile, {
  type GalleryItemData,
} from "@/components/sections/GalleryTile";
import {
  replaceGalleryImage,
  deleteGalleryItem,
  updateGalleryCaption,
  type MediaState,
} from "@/lib/actions/media";

export default function GalleryItemCard({ item }: { item: GalleryItemData }) {
  const [state, action, pending] = useActionState<MediaState, FormData>(
    replaceGalleryImage,
    undefined
  );

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-4">
      <GalleryTile item={item} />

      <form action={updateGalleryCaption} className="flex gap-2">
        <input type="hidden" name="id" value={item.id} />
        <input
          name="caption"
          defaultValue={item.caption}
          aria-label="عنوان تصویر"
          className="min-w-0 flex-1 rounded-xl border border-red-100 px-3 py-2 text-sm outline-none focus:border-red-400"
        />
        <button
          type="submit"
          aria-label="ذخیره عنوان"
          className="inline-flex items-center rounded-xl border border-red-200 px-3 text-red-600 transition-colors hover:bg-red-50"
        >
          <Save className="h-4 w-4" />
        </button>
      </form>

      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={item.id} />
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          aria-label="جایگزینی تصویر"
          className="w-full rounded-xl border border-red-100 px-3 py-2 text-xs outline-none file:ml-2 file:rounded-full file:border-0 file:bg-red-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-red-600 focus:border-red-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          <Repeat className="h-3.5 w-3.5" />
          {pending ? "در حال جایگزینی…" : "جایگزینی تصویر"}
        </button>
      </form>

      {state?.error && (
        <p className="flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {state.error}
        </p>
      )}

      <form action={deleteGalleryItem}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
        >
          <Trash2 className="h-3.5 w-3.5" />
          حذف تصویر
        </button>
      </form>
    </article>
  );
}
