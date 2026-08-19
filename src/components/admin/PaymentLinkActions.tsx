"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

/**
 * The link itself is rendered by the server as a plain, selectable input plus a normal
 * anchor, so the coach can always copy it by hand. The button here is a convenience on
 * top — `navigator.clipboard` needs a secure context and silently isn't there over plain
 * HTTP on a LAN address, which is exactly how this panel gets opened from a phone.
 */
export default function PaymentLinkActions({
  url,
  whatsappHref,
}: {
  url: string;
  whatsappHref: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the input next to this button is still selectable.
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        readOnly
        value={url}
        dir="ltr"
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-xs text-ink-700 outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "کپی شد" : "کپی"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        ارسال در واتساپ
      </a>
    </div>
  );
}
