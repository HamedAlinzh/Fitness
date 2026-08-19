/**
 * The coach's *own* contact details — the counterpart to `src/lib/contact-links.ts`,
 * which builds links pointing at a lead. Kept as a plain module (same idea as the
 * account handle in `src/lib/instagram.ts`) so the number is written down once.
 *
 * Stored in the national `09xxxxxxxxx` form that `normalizePhone` produces, so the
 * link builders in `contact-links.ts` accept it unchanged.
 */

export const COACH_PHONE = "09209102800";

/** Optional; when set it's preferred over the phone link for Telegram. */
export const COACH_TELEGRAM_USERNAME: string | null = null;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Persian digits for display. The site writes every other number in Persian digits
 * (via `toLocaleString("fa-IR")`), and a phone number rendered in ASCII next to that
 * copy looks like a bug.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/**
 * Grouped for readability: `۰۹۲۰ ۹۱۰ ۲۸۰۰`. Grouping is done on the ASCII digits and
 * converted afterwards so the slice offsets stay obvious.
 */
export function formatPhoneForDisplay(nationalPhone: string): string {
  const grouped = `${nationalPhone.slice(0, 4)} ${nationalPhone.slice(
    4,
    7
  )} ${nationalPhone.slice(7)}`;
  return toPersianDigits(grouped);
}

export const COACH_PHONE_DISPLAY = formatPhoneForDisplay(COACH_PHONE);
