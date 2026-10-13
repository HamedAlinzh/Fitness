"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Save, Sparkles, Trash2 } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import {
  updateAboutContent,
  removeAboutImage,
  type AboutState,
} from "@/lib/actions/about";
import { ABOUT_LIMITS, type AboutEditable } from "@/lib/about";

const fieldClass =
  "rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400";

export default function AboutContentForm({ about }: { about: AboutEditable }) {
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
        className="flex flex-1 flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-start"
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

        <fieldset className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-4">
          <legend className="px-2 text-sm font-bold text-ink-900">
            نسخه‌ی انگلیسی (اختیاری)
          </legend>
          <p className="text-xs leading-6 text-ink-500">
            در صفحه‌های انگلیسی سایت (<span dir="ltr">/en</span>) نمایش داده می‌شود. هر
            فیلدی که خالی بماند، متن فارسی همان فیلد نشان داده می‌شود.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="about-eyebrow-en" className="text-sm font-medium text-ink-700">
              Eyebrow
            </label>
            <input
              id="about-eyebrow-en"
              name="eyebrowEn"
              type="text"
              dir="ltr"
              maxLength={ABOUT_LIMITS.eyebrow}
              defaultValue={about.eyebrowEn}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="about-heading-en" className="text-sm font-medium text-ink-700">
              Heading
            </label>
            <input
              id="about-heading-en"
              name="headingEn"
              type="text"
              dir="ltr"
              maxLength={ABOUT_LIMITS.heading}
              defaultValue={about.headingEn}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="about-preview-en" className="text-sm font-medium text-ink-700">
              Homepage summary
            </label>
            <textarea
              id="about-preview-en"
              name="previewTextEn"
              rows={4}
              dir="ltr"
              maxLength={ABOUT_LIMITS.previewText}
              defaultValue={about.previewTextEn}
              className={`${fieldClass} resize-y leading-7`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="about-body-en" className="text-sm font-medium text-ink-700">
              Full about-page text
            </label>
            <textarea
              id="about-body-en"
              name="bodyTextEn"
              rows={10}
              dir="ltr"
              maxLength={ABOUT_LIMITS.bodyText}
              defaultValue={about.bodyTextEn}
              className={`${fieldClass} resize-y leading-7`}
            />
          </div>
        </fieldset>

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
