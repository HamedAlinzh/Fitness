"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-pink-100 bg-white p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-pink-500" />
        <h3 className="text-lg font-bold text-ink-900">پیامت ثبت شد!</h3>
        <p className="text-sm leading-7 text-ink-500">
          به‌زودی باهات تماس می‌گیرم. ممنون از اعتمادت.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-pink-100 bg-white p-6 text-right sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-ink-700">
            نام و نام خانوادگی
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-pink-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-ink-700">
            شماره تماس
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-pink-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mode" className="text-sm font-medium text-ink-700">
          نوع مربیگری مد نظرت
        </label>
        <select
          id="mode"
          name="mode"
          className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-pink-400"
        >
          <option value="online">آنلاین</option>
          <option value="in-person">حضوری در شیراز</option>
          <option value="not-sure">هنوز مطمئن نیستم</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink-700">
          هدفت رو برام بنویس
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-pink-400"
        />
      </div>

      <Button type="submit" className="mt-2 w-full">
        <Send className="h-4 w-4" />
        ارسال درخواست مشاوره
      </Button>
    </form>
  );
}
