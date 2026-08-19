/**
 * Shared runtime values for payment links. Plain (non-`"use server"`) module, because a
 * `"use server"` file may only export async functions — same split as
 * `src/lib/leads.ts` vs `src/lib/actions/leads.ts`.
 *
 * ## Money units — read this before touching an amount
 *
 * Two units are in play and mixing them is a factor-of-10 mistake:
 *
 * - `Package.priceToman` is in **whole toman**, the unit the coach types into
 *   /admin/packages and the unit everything shown to a person is in, because that is
 *   what Iranians actually quote prices in.
 * - `Order.amountRial` is in **rial**. It's the amount that will eventually be handed to
 *   a payment gateway, and every Iranian gateway settles in rial.
 *
 * Both column names carry their unit, so a call site that reads `pkg.priceToman` into an
 * amountRial field is wrong on its face. Convert only through the helpers below; never
 * multiply by a literal at a call site.
 */

export const ORDER_STATUSES = ["PENDING", "PAID", "CANCELED"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  CANCELED: "لغو شده",
};

/** Tailwind classes per status, for the admin list badges. */
export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-red-50 text-red-700",
  PAID: "bg-green-100 text-green-800",
  CANCELED: "bg-ink-100 text-ink-500",
};

const RIAL_PER_TOMAN = 10;

export function tomanToRial(toman: number): number {
  return toman * RIAL_PER_TOMAN;
}

export function rialToToman(rial: number): number {
  return Math.round(rial / RIAL_PER_TOMAN);
}

/** e.g. `۹٬۹۰۰٬۰۰۰ تومان` — always from a rial amount, so callers can't pick the unit. */
export function formatRialAsToman(rial: number): string {
  return `${rialToToman(rial).toLocaleString("fa-IR")} تومان`;
}

/** e.g. `۳٬۲۰۰٬۰۰۰ تومان`, for a package's list price. */
export function formatToman(toman: number): string {
  return `${toman.toLocaleString("fa-IR")} تومان`;
}

/** Upper bound for an admin-entered price: a typo like a stray zero shouldn't stick. */
export const MAX_PRICE_TOMAN = 500_000_000;

/**
 * Parses a toman amount typed by a person. Persian/Arabic-Indic digits and whatever
 * thousands separators they reach for (`٬` `,` `.` `٫` space) are all accepted, so
 * "۳٬۲۰۰٬۰۰۰" and "3.200.000" and "3200000" mean the same thing.
 *
 * Returns null for anything that isn't a usable price, so the caller decides the wording
 * of the error. `reason` distinguishes "you typed nonsense" from "that's absurdly large",
 * which is worth telling apart — the second is almost always one extra zero.
 */
export function parsePriceToman(
  raw: string
): { ok: true; value: number } | { ok: false; reason: "empty" | "invalid" | "too-large" } {
  const digits = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");

  if (!digits) return { ok: false, reason: "empty" };

  const value = Number(digits);
  if (!Number.isSafeInteger(value) || value <= 0) {
    return { ok: false, reason: "invalid" };
  }
  if (value > MAX_PRICE_TOMAN) return { ok: false, reason: "too-large" };

  return { ok: true, value };
}

/**
 * How long an issued link stays payable. Prices change and a link is the only thing
 * standing between a stranger and a checkout, so they don't live forever.
 */
export const PAYMENT_LINK_TTL_DAYS = 7;

export function paymentLinkExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + PAYMENT_LINK_TTL_DAYS * 24 * 60 * 60 * 1000);
}

type OrderTiming = { status: string; expiresAt: Date | null };

/**
 * A still-pending order whose link has timed out. Paid and canceled orders are never
 * "expired" — their state is already final and saying so would just confuse the reader.
 *
 * The clock read lives here rather than at the call sites both because the two pages
 * that need it would otherwise duplicate the rule, and because `Date.now()` inside a
 * component body trips the `react-hooks/purity` lint rule.
 */
export function isExpired(order: OrderTiming): boolean {
  return (
    order.status === "PENDING" &&
    !!order.expiresAt &&
    order.expiresAt.getTime() <= Date.now()
  );
}

export function isPayable(order: OrderTiming): boolean {
  return order.status === "PENDING" && !isExpired(order);
}

export function paymentPath(token: string): string {
  return `/pay/${token}`;
}
