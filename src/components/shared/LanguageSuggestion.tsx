"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { LOCALE_COOKIE, rememberLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * "View this site in English?" — offered once, to a visitor on the Persian site whose
 * browser is set to English and who has never picked a language.
 *
 * The signal is `navigator.languages`, i.e. the visitor's own setting, rather than their
 * IP address: an Iranian abroad or anyone on a VPN would be misjudged by geolocation. It
 * runs only on the client and renders nothing on the server, so the page stays statically
 * rendered and nothing is shown to (or hidden from) a visitor with JavaScript off. Either answer
 * is remembered in the `lang` cookie, which also stops it appearing again.
 */
const subscribe = () => () => {};

/** Read on the client only; the server snapshot below is `false`, so nothing is rendered there. */
function shouldSuggest(): boolean {
  try {
    if (document.cookie.split("; ").some((c) => c.startsWith(`${LOCALE_COOKIE}=`))) {
      return false;
    }
    const preferred = navigator.languages?.[0] ?? navigator.language ?? "";
    return /^en\b/i.test(preferred);
  } catch {
    // No access to cookies or navigator — just don't show the banner.
    return false;
  }
}

export default function LanguageSuggestion() {
  const eligible = useSyncExternalStore(subscribe, shouldSuggest, () => false);
  const [dismissed, setDismissed] = useState(false);
  const visible = eligible && !dismissed;
  const text = getDictionary("en").suggest;

  if (!visible) return null;

  return (
    <div
      dir="ltr"
      lang="en"
      role="region"
      aria-label="Language"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm text-ink-700 shadow-lg shadow-red-200/50"
    >
      <span>{text.text}</span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            rememberLocale("fa");
            setDismissed(true);
          }}
          className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-ink-500 hover:bg-red-50"
        >
          {text.dismiss}
        </button>
        <Link
          href="/en"
          onClick={() => rememberLocale("en")}
          className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-600"
        >
          {text.accept}
        </Link>
      </span>
    </div>
  );
}
