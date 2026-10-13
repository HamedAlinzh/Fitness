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
 * Like `normalizePhone`, but also accepts a foreign number written with its country code
 * (`+44 7700 900123`, `0044…`), which the English site has to allow — its visitors are
 * often outside Iran. Iranian numbers come back in the national `09xxxxxxxxx` form,
 * foreign ones as `+<digits>`; `toInternational` understands both.
 */
export function normalizeContactPhone(raw: string): string | null {
  const iranian = normalizePhone(raw);
  if (iranian) return iranian;

  const digits = toAsciiDigits(raw).replace(/[\s().-]/g, "");
  const international = digits.replace(/^00/, "+");
  // E.164 allows at most 15 digits; fewer than 8 is not a real subscriber number.
  return /^\+[1-9]\d{7,14}$/.test(international) ? international : null;
}

/**
 * E.164 without the leading `+`, e.g. `989121234567` — the form both wa.me and
 * t.me expect.
 */
export function toInternational(phone: string): string {
  if (phone.startsWith("+")) return phone.slice(1);
  return `98${phone.slice(1)}`;
}
