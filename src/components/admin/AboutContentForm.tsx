"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Save, Sparkles, Trash2 } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import {
  updateAboutContent,
  removeAboutImage,
  type AboutState,
} from "@/lib/actions/about";
import { ABOUT_LIMITS, type AboutContent } from "@/lib/about";

const fieldClass =
  "rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400";

export default function AboutContentForm({ about }: { about: AboutContent }) {
  const [state, action, pending] = useActionState<AboutState, FormData>(
    updateAboutContent,
    undefined
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
      <aside className="flex w-full flex-col gap-3 rounded-3xl border border-red-100 bg-white p-6 lg:w-72 lg:shrink-0">
        <h2 className="text-base font-bold text-ink-900">عکس فعلی</h2>

        <PlaceholderMedia
          icon={Sparkles}
          variant={1}
          src={about.image}
          alt={about.heading}
          className="aspect-[4/5] w-full rounded-3xl"
        />

        {about.image ? (
          <form action={removeAboutImage}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف عکس
            </button>
          </form>
        ) : (
          <p className="text-xs leading-6 text-ink-500">
            هنوز عکسی انتخاب نشده و به جای آن یک کادر رنگی نمایش داده می‌شود.
          </p>
        )}
      </aside>

      <form
        action={action}
        className="flex flex-1 flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="about-eyebrow" className="text-sm font-medium text-ink-700">
            برچسب کوچک بالای عنوان
          </label>
          <input
            id="about-eyebrow"
            name="eyebrow"
            type="text"
            required
            maxLength={ABOUT_LIMITS.eyebrow}
            defaultValue={about.eyebrow}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="about-heading" className="text-sm font-medium text-ink-700">
            عنوان اصلی
          </label>
          <input
            id="about-heading"
            name="heading"
            type="text"
            required
            maxLength={ABOUT_LIMITS.heading}
            defaultValue={about.heading}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="about-preview"
            className="text-sm font-medium text-ink-700"
          >
            متن کوتاه صفحه‌ی اصلی
          </label>
          <textarea
            id="about-preview"
            name="previewText"
            required
            rows={4}
            maxLength={ABOUT_LIMITS.previewText}
            defaultValue={about.previewText}
            className={`${fieldClass} resize-y leading-8`}
          />
          <p className="text-xs text-ink-500">
            همان یک پاراگرافی که در صفحه‌ی اصلی، بخش «درباره من» دیده می‌شود.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="about-body" className="text-sm font-medium text-ink-700">
            متن کامل صفحه‌ی «درباره من»
          </label>
          <textarea
            id="about-body"
            name="bodyText"
            required
            rows={10}
            maxLength={ABOUT_LIMITS.bodyText}
            defaultValue={about.bodyText}
            className={`${fieldClass} resize-y leading-8`}
          />
          <p className="text-xs text-ink-500">
            برای شروع پاراگراف جدید، یک خط فاصله بگذار.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="about-image" className="text-sm font-medium text-ink-700">
            عکس جدید (JPG، PNG یا WebP — حداکثر ۵ مگابایت)
          </label>
          <input
            id="about-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={`${fieldClass} file:ml-3 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-red-600`}
          />
          <p className="text-xs text-ink-500">
            اختیاری است؛ اگر فایلی انتخاب نکنی عکس فعلی دست‌نخورده می‌ماند.
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
          <Save className="h-4 w-4" />
          {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
