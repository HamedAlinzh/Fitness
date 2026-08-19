import { toInternational } from "@/lib/phone";

/**
 * One-click reply links for the admin panel. The lead's phone number alone is enough for
 * every channel — WhatsApp has no separate account id (the number *is* the identity) and
 * Telegram resolves numbers via `t.me/+<phone>` per
 * https://core.telegram.org/api/links.
 *
 * The Telegram phone link only resolves when the recipient allows being found by phone
 * number ("Who can find me by my phone number"), which is why `telegramUsername` exists
 * as an optional fallback and is preferred here when present.
 */

export function whatsappUrl(nationalPhone: string, message?: string): string {
  const base = `https://wa.me/${toInternational(nationalPhone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telegramUrl(
  nationalPhone: string,
  username?: string | null,
  message?: string
): string {
  const handle = username?.trim().replace(/^@/, "");
  const base = handle
    ? `https://t.me/${handle}`
    : `https://t.me/+${toInternational(nationalPhone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(nationalPhone: string): string {
  return `tel:+${toInternational(nationalPhone)}`;
}

export function smsUrl(nationalPhone: string, message?: string): string {
  const base = `sms:+${toInternational(nationalPhone)}`;
  // `?&body=` is the cross-platform form that works on both iOS and Android.
  return message ? `${base}?&body=${encodeURIComponent(message)}` : base;
}

/** Opening line pre-filled into WhatsApp/Telegram/SMS so the coach doesn't retype it. */
export function greetingFor(name: string): string {
  return `سلام ${name} عزیز، درخواست مشاوره‌ات رو دریافت کردم. در خدمتم 🌹`;
}
