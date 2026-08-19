"use client";

import { useActionState, useRef, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadGalleryItem, type MediaState } from "@/lib/actions/media";

export default function GalleryUploadForm() {
  const [state, action, pending] = useActionState<MediaState, FormData>(
    uploadGalleryItem,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the picked file and caption once the upload lands, so the next one starts fresh.
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right"
    >
      <h2 className="text-base font-bold text-ink-900">افزودن تصویر جدید</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="caption" className="text-sm font-medium text-ink-700">
            عنوان
          </label>
          <input
            id="caption"
            name="caption"
            type="text"
            required
            className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium text-ink-700">
            نوع
          </label>
          <select
            id="type"
            name="type"
            className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
          >
            <option value="IMAGE">عکس</option>
            <option value="VIDEO">ویدیو</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="text-sm font-medium text-ink-700">
          فایل تصویر (JPG، PNG یا WebP — حداکثر ۵ مگابایت)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none file:ml-3 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-red-600 focus:border-red-400"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />
        {pending ? "در حال بارگذاری…" : "بارگذاری تصویر"}
      </button>
    </form>
  );
}
