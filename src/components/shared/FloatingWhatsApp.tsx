import { MessageCircle } from "lucide-react";
import { COACH_PHONE } from "@/lib/site-contact";
import { whatsappUrl } from "@/lib/contact-links";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * A thumb-reach WhatsApp button on phones, where the navbar CTA scrolls away. A plain
 * anchor, so it works before hydration and with JS off. Desktop already has the CTA in
 * the sticky navbar, so it is hidden from `md` up. It sits below `LanguageSuggestion`
 * (z-50), which covers it for the moment that banner is showing.
 */
export default function FloatingWhatsApp({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).footer;

  return (
    <a
      href={whatsappUrl(COACH_PHONE, t.whatsappGreeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp}
      title={t.whatsapp}
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-background shadow-xl shadow-red-500/40 transition-transform active:scale-95 md:hidden"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-red-500/60 motion-safe:animate-ping motion-safe:[animation-duration:2.5s]"
      />
      <MessageCircle className="relative h-6 w-6" strokeWidth={2.25} />
    </a>
  );
}
