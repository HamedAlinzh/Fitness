"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, LinkIcon } from "lucide-react";
import { createOrder, type CreateOrderState } from "@/lib/actions/orders";
import { formatToman } from "@/lib/orders";

export type PackageOption = {
  id: string;
  title: string;
  priceToman: number;
  periodLabel: string;
};

const fieldClasses =
  "rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400";

export default function CreateOrderForm({
  packages,
}: {
  packages: PackageOption[];
}) {
  const [state, action, pending] = useActionState<CreateOrderState, FormData>(
    createOrder,
    undefined
  );

  if (packages.length === 0) {
    return (
      <p className="rounded-3xl border border-red-100 bg-white p-6 text-sm text-ink-500">
        هنوز پلنی تعریف نشده است، پس نمی‌شود لینک پرداخت ساخت.
      </p>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right"
    >
      <div>
        <h2 className="text-base font-bold text-ink-900">
          صدور لینک پرداخت تازه
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          بعد از هماهنگی با شاگرد، لینک را بساز و برایش بفرست. برای پرداخت نیازی به
          ثبت‌نام ندارد.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="packageId" className="text-sm font-medium text-ink-700">
            پلن
          </label>
          <select id="packageId" name="packageId" className={fieldClasses}>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — {formatToman(p.priceToman)} / {p.periodLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="amountToman"
            className="text-sm font-medium text-ink-700"
          >
            مبلغ به تومان (اختیاری)
          </label>
          <input
            id="amountToman"
            name="amountToman"
            type="text"
            inputMode="numeric"
            placeholder="خالی بگذار تا قیمت خود پلن حساب شود"
            className={fieldClasses}
          />
          <span className="text-xs text-ink-500">
            برای تخفیف یا پرداخت قسطی، مبلغ دلخواه را اینجا بنویس.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="customerName"
            className="text-sm font-medium text-ink-700"
          >
            نام شاگرد
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            maxLength={50}
            className={fieldClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="customerPhone"
            className="text-sm font-medium text-ink-700"
          >
            شماره موبایل شاگرد
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            inputMode="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-ink-700">
          یادداشت (اختیاری، فقط برای خودت)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          maxLength={500}
          className={fieldClasses}
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        <LinkIcon className="h-4 w-4" />
        {pending ? "در حال ساخت…" : "ساخت لینک پرداخت"}
      </button>
    </form>
  );
}
