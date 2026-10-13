"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Save } from "lucide-react";
import {
  updatePackageEnglish,
  type UpdatePackageEnglishState,
} from "@/lib/actions/packages";
import { PACKAGE_EN_LIMITS, parseFeatures } from "@/lib/packages";

const fieldClass =
  "rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400";

/**
 * The English text of one plan, shown on /en. Left blank, the Persian text is used
 * instead, so plans can be translated one at a time.
 */
export default function PackageEnglishForm({
  id,
  titleEn,
  periodLabelEn,
  featuresEn,
}: {
  id: string;
  titleEn: string;
  periodLabelEn: string;
  featuresEn: string;
}) {
  const [state, action, pending] = useActionState<
    UpdatePackageEnglishState,
    FormData
  >(updatePackageEnglish, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <h3 className="text-sm font-bold text-ink-900">
        نسخه‌ی انگلیسی (اختیاری)
      </h3>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`title-en-${id}`} className="text-xs font-medium text-ink-700">
            Plan name
          </label>
          <input
            id={`title-en-${id}`}
            name="titleEn"
            dir="ltr"
            maxLength={PACKAGE_EN_LIMITS.title}
            defaultValue={titleEn}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`period-en-${id}`} className="text-xs font-medium text-ink-700">
            Period (e.g. 12 sessions)
          </label>
          <input
            id={`period-en-${id}`}
            name="periodLabelEn"
            dir="ltr"
            maxLength={PACKAGE_EN_LIMITS.periodLabel}
            defaultValue={periodLabelEn}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`features-en-${id}`} className="text-xs font-medium text-ink-700">
          Features — one per line
        </label>
        <textarea
          id={`features-en-${id}`}
          name="featuresEn"
          dir="ltr"
          rows={4}
          defaultValue={parseFeatures(featuresEn).join("\n")}
          className={`${fieldClass} resize-y leading-7`}
        />
        <p className="text-xs text-ink-500">
          اگر خالی بماند، ویژگی‌های فارسی نمایش داده می‌شود.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {pending ? "در حال ذخیره…" : "ذخیره‌ی انگلیسی"}
        </button>
        {state?.error && (
          <p className="flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="flex items-center gap-2 text-xs font-semibold text-green-700">
            <Check className="h-3.5 w-3.5 shrink-0" />
            {state.success}
          </p>
        )}
      </div>
    </form>
  );
}
