"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { uploadGalleryItem, type MediaState } from "@/lib/actions/media";
import { MEDIA_ACCEPT } from "@/lib/media";
import MediaFileInput from "@/components/admin/MediaFileInput";

export default function GalleryUploadForm() {
  const [state, action, pending] = useActionState<MediaState, FormData>(
    uploadGalleryItem,
    undefined
  );
  const [preparing, setPreparing] = useState(false);

  /**
   * Blocks a second submit of the same form.
   *
   * `pending` alone is not enough: it only exists once this component has hydrated, and
   * the form is submittable before that (React submits it natively). On a slow phone
   * connection that window is long enough for the coach to tap twice and store the photo
   * twice — the same class of problem the consultation form's "next" button had. This ref
   * closes the gap after hydration; the server-side duplicate check in `uploadGalleryItem`
   * is what covers it before hydration, since no CSS or markup can express "already
   * submitted" on its own.
   */
  const submitted = useRef(false);

  // A refused upload leaves the coach on the form, so let them try again.
  useEffect(() => {
    if (state?.error) submitted.current = false;
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (submitted.current || preparing) {
      event.preventDefault();
      return;
    }
    submitted.current = true;
  }

  const busy = pending || preparing;

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-start"
    >
      <h2 className="text-base font-bold text-ink-900">افزودن عکس یا ویدیو</h2>

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
        <label htmlFor="file" className="text-sm font-medium text-ink-700">
          فایل عکس یا ویدیو
        </label>
        <p className="text-xs text-ink-500">
          عکس: JPG، PNG یا WebP تا ۵ مگابایت · ویدیو: MP4، MOV یا WebM تا ۴۵ مگابایت.
          نوع از روی خود فایل تشخیص داده می‌شود.
        </p>
        <MediaFileInput
          id="file"
          name="file"
          accept={MEDIA_ACCEPT}
          required
          onBusyChange={setPreparing}
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none file:ml-3 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-red-600 focus:border-red-400"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />
        {pending
          ? "در حال بارگذاری…"
          : preparing
            ? "در حال آماده‌سازی…"
            : "بارگذاری فایل"}
      </button>
    </form>
  );
}
