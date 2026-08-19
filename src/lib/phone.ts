/**
 * Iranian mobile number handling, shared by the testimonial and consultation forms.
 * Persian/Arabic-Indic digits are converted first so a Persian keyboard entry validates.
 */

export function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Returns the national form (`09xxxxxxxxx`) or null when the number isn't valid. */
export function normalizePhone(raw: string): string | null {
  const digits = toAsciiDigits(raw).replace(/[\s()-]/g, "");
  const national = digits
    .replace(/^\+98/, "0")
    .replace(/^0098/, "0")
    .replace(/^98(?=9\d{9}$)/, "0");

  return /^09\d{9}$/.test(national) ? national : null;
}

/**
 * E.164 without the leading `+`, e.g. `989121234567` — the form both wa.me and
 * t.me expect.
 */
export function toInternational(nationalPhone: string): string {
  return `98${nationalPhone.slice(1)}`;
}
