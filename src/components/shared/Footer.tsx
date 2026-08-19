import Link from "next/link";
import { INSTAGRAM_PROFILE_URL } from "@/lib/instagram";

const quickLinks = [
  { href: "/about", label: "درباره من" },
  { href: "/gallery", label: "گالری" },
  { href: "/pricing", label: "برنامه‌ها" },
  { href: "/blog", label: "بلاگ" },
  { href: "/testimonials", label: "نظرات شاگردان" },
];

const socials = [
  { href: INSTAGRAM_PROFILE_URL, label: "اینستاگرام", external: true },
  { href: "#", label: "واتساپ", external: false },
  { href: "#", label: "تلگرام", external: false },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-red-100 bg-red-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold text-red-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white">
              ف
            </span>
            کوچ فیت
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-500">
            مربیگری تخصصی بدنسازی و تناسب اندام، به‌صورت حضوری در شیراز و آنلاین در سراسر ایران.
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
          <ul className="mt-4 flex flex-col gap-2">
            {socials.map((social) => (
              <li key={social.label}>
                {social.external ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-500 transition-colors hover:text-red-600"
                  >
                    {social.label}
                  </a>
                ) : (
                  <Link
                    href={social.href}
                    className="text-sm text-ink-500 transition-colors hover:text-red-600"
                  >
                    {social.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-red-100 px-4 py-4 text-center text-xs text-ink-500 sm:px-6">
        © {new Date().getFullYear()} کوچ فیت. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
