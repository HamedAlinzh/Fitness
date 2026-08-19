"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  submitTestimonial,
  type SubmitTestimonialState,
} from "@/lib/actions/submit-testimonial";

export default function TestimonialForm() {
  const [state, action, pending] = useActionState<
    SubmitTestimonialState,
    FormData
  >(submitTestimonial, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="studentName"
            className="text-sm font-medium text-ink-700"
          >
            نام و نام خانوادگی
          </label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            required
            maxLength={50}
            className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-ink-700">
            شماره موبایل
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
          <span className="text-xs text-ink-500">
            شماره‌ات روی سایت نمایش داده نمی‌شود و فقط برای تایید نظر است.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-ink-700">
          نظرت رو بنویس
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          required
          minLength={10}
          maxLength={1000}
          className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {pending ? "در حال ثبت…" : "ثبت نظر"}
      </button>
    </form>
  );
}
