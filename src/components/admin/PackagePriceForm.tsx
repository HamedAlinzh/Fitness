"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Save } from "lucide-react";
import {
  updatePackagePrice,
  type UpdatePriceState,
} from "@/lib/actions/packages";
import { formatToman } from "@/lib/orders";

/**
 * One instance per plan, each with its own action state, so an error on one row never
 * blanks out another row's feedback.
 */
export default function PackagePriceForm({
  id,
  priceToman,
}: {
  id: string;
  priceToman: number;
}) {
  const [state, action, pending] = useActionState<UpdatePriceState, FormData>(
    updatePackagePrice,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <label
        htmlFor={`price-${id}`}
        className="text-sm font-medium text-ink-700"
      >
        قیمت به تومان
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input
          id={`price-${id}`}
          name="priceToman"
          type="text"
          inputMode="numeric"
          dir="ltr"
          defaultValue={priceToman}
          className="w-44 rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {pending ? "در حال ذخیره…" : "ذخیره"}
        </button>
        <span className="text-xs text-ink-500">
          الان: {formatToman(priceToman)}
        </span>
      </div>

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
    </form>
  );
}
