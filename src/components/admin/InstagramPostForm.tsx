"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, AtSign, CheckCircle2 } from "lucide-react";
import {
  addInstagramPost,
  type InstagramState,
} from "@/lib/actions/instagram";
import { INSTAGRAM_FEED_SIZE } from "@/lib/instagram";

export default function InstagramPostForm() {
  const [state, action, pending] = useActionState<InstagramState, FormData>(
    addInstagramPost,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the link and the picked file once it lands, so the next post starts fresh.
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right"
    >
      <div>
        <h2 className="text-base font-bold text-ink-900">افزودن پست جدید</h2>
        <p className="mt-1 text-sm leading-7 text-ink-500">
          پست تازه به ابتدای بخش اینستاگرام صفحه‌ی اصلی می‌آید و قدیمی‌ترین پست از آنجا
          حذف می‌شود؛ همیشه {INSTAGRAM_FEED_SIZE.toLocaleString("fa-IR")} پست آخر نمایش
          داده می‌شود.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ig-url" className="text-sm font-medium text-ink-700">
          لینک پست در اینستاگرام
        </label>
        <input
          id="ig-url"
          name="url"
          type="text"
          inputMode="url"
          dir="ltr"
          required
          placeholder="https://www.instagram.com/reel/..."
          className="rounded-xl border border-red-100 px-4 py-2.5 text-left text-sm outline-none focus:border-red-400"
        />
        <p className="text-xs leading-6 text-ink-500">
          پست را در اینستاگرام باز کن و نشانی نوار آدرس را کپی کن. ریلز و پست هر دو
          قبول است و نوعش خودکار تشخیص داده می‌شود.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ig-screenshot" className="text-sm font-medium text-ink-700">
          اسکرین‌شات پست (JPG، PNG یا WebP — حداکثر ۵ مگابایت)
        </label>
        <input
          id="ig-screenshot"
          name="screenshot"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none file:ml-3 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-red-600 focus:border-red-400"
        />
        <p className="text-xs leading-6 text-ink-500">
          کادر پست‌ها مربع است، پس تصویر مربعی بهترین نتیجه را می‌دهد؛ تصویر بلند از
          بالا و پایین بریده می‌شود.
        </p>
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
        <AtSign className="h-4 w-4" />
        {pending ? "در حال افزودن…" : "افزودن پست"}
      </button>
    </form>
  );
}
