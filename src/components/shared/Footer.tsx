import Link from "next/link";
import { AtSign, MessageCircle, Send } from "lucide-react";
import { INSTAGRAM_PROFILE_URL } from "@/lib/instagram";
import { SITE_LOGO_MARK, SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { COACH_PHONE, COACH_TELEGRAM_USERNAME } from "@/lib/site-contact";
import { telegramUrl, whatsappUrl } from "@/lib/contact-links";

const quickLinks = [
  { href: "/about", label: "درباره من" },
  { href: "/gallery", label: "گالری" },
  { href: "/pricing", label: "برنامه‌ها" },
  { href: "/blog", label: "بلاگ" },
  { href: "/testimonials", label: "نظرات شاگردان" },
];

const whatsappGreeting = "سلام، از سایت اومدم و می‌خواستم درباره برنامه‌ها بپرسم.";

/**
 * Every channel here is an external app link, so they are plain anchors rather than
 * `next/link` — and the whole column works with no JavaScript.
 *
 * WhatsApp needs no separate account id: the phone number *is* the identity. Telegram
 * uses the username rather than `t.me/+<number>`, because the number form only resolves
 * when the recipient allows being found by phone. No `?text=` is passed to Telegram —
 * unlike `wa.me`, prefilled text is not documented for a `t.me/<username>` profile link,
 * so it would be shipping something that may silently do nothing.
 *
 * They render as bare icons. `label` is therefore not printed anywhere and exists only
 * as the link's accessible name (plus the hover tooltip) — without it an icon-only link
 * is announced as nothing at all by a screen reader.
 */
const channels = [
  {
    href: INSTAGRAM_PROFILE_URL,
    label: "اینستاگرام",
    icon: AtSign,
  },
  {
    href: whatsappUrl(COACH_PHONE, whatsappGreeting),
    label: "واتساپ",
    icon: MessageCircle,
  },
  {
    href: telegramUrl(COACH_PHONE, COACH_TELEGRAM_USERNAME),
    label: "تلگرام",
    icon: Send,
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-red-100 bg-red-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold text-red-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white">
              {SITE_LOGO_MARK}
            </span>
            <span dir="ltr">{SITE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-500">
            {SITE_TAGLINE}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink-900">دسترسی سریع</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-500 transition-colors hover:text-red-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink-900">ارتباط با من</h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={channel.label}
                  title={channel.label}
                  // 44px: with no text beside it the icon is the whole tap target.
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  <channel.icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-red-100 px-4 py-4 text-center text-xs text-ink-500 sm:px-6">
        © {new Date().getFullYear()} <span dir="ltr">{SITE_NAME}</span>. تمامی حقوق
        محفوظ است.
      </div>
    </footer>
  );
}
