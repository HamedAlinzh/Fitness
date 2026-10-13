"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
  SITE_LOGO_HEIGHT,
  SITE_LOGO_SRC,
  SITE_LOGO_WIDTH,
  SITE_NAME,
} from "@/lib/brand";
import {
  localePath,
  rememberLocale,
  stripLocale,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function Navbar({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const nav = dict.nav;
  const navLinks = [
    { href: "/", label: nav.home },
    { href: "/about", label: nav.about },
    { href: "/gallery", label: nav.gallery },
    { href: "/pricing", label: nav.plans },
    { href: "/testimonials", label: nav.testimonials },
    { href: "/blog", label: nav.blog },
    { href: "/contact", label: nav.contact },
  ];

  // A two-option segmented control: both languages are always visible, the current one is
  // highlighted and the other is a plain anchor to the same page, so switching works
  // before hydration and with JS off. The cookie write is the enhancement: it lets a later
  // visit to `/` open in the language the visitor picked.
  const pathname = usePathname();
  const path = stripLocale(pathname);
  const options: { code: Locale; label: string; name: string }[] = [
    { code: "fa", label: "فارسی", name: "فارسی" },
    { code: "en", label: "EN", name: "English" },
  ];
  const switcher = (
    <div
      role="group"
      aria-label={nav.switchLabel}
      className="inline-flex items-center rounded-full border border-red-200 bg-red-50/60 p-0.5 text-xs font-bold"
    >
      {options.map((option) =>
        option.code === lang ? (
          <span
            key={option.code}
            lang={option.code}
            aria-current="true"
            title={option.name}
            className="rounded-full bg-red-500 px-3 py-1 text-white shadow-sm"
          >
            {option.label}
          </span>
        ) : (
          <a
            key={option.code}
            href={switchLocalePath(lang, path)}
            hrefLang={option.code}
            lang={option.code}
            title={option.name}
            aria-label={option.name}
            onClick={() => rememberLocale(option.code)}
            className="rounded-full px-3 py-1 text-red-600 transition-colors hover:bg-red-100"
          >
            {option.label}
          </a>
        )
      )}
    </div>
  );

  // The menu open/close itself is native <details> behaviour, so it works even
  // when client-side JS never runs (see the note in CLAUDE.md about content and
  // interactions never depending on hydration). This ref is only a progressive
  // enhancement: when JS *is* running, App Router navigations are soft, so the
  // panel has to be closed manually after a link is tapped.
  const menuRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={localePath(lang, "/")} className="flex items-center gap-2 text-lg font-extrabold text-red-600">
          {/* Decorative: the brand name follows as text in the same link, so an alt
              text here would only make a screen reader announce it twice. */}
          <Image
            src={SITE_LOGO_SRC}
            alt=""
            width={SITE_LOGO_WIDTH}
            height={SITE_LOGO_HEIGHT}
            // The artwork is ~870px wide but is painted at ~60px here; without `sizes`
            // next/image would size the srcset from the intrinsic width and ship a 1080px
            // copy into the header of every page.
            sizes="60px"
            priority
            className="h-9 w-auto"
          />
          {/* A Latin name inside an RTL line: dir="ltr" keeps the words in order. */}
          <span dir="ltr">{SITE_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={localePath(lang, link.href)}
                className="text-sm font-medium text-ink-700 transition-colors hover:text-red-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
        {switcher}
        <Link
          href={localePath(lang, "/contact")}
          className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-red-300 transition-colors hover:bg-red-600"
        >
          {nav.cta}
        </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
        {switcher}

        <details ref={menuRef} className="md:hidden">
          <summary
            aria-label={nav.menuLabel}
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-ink-700 select-none hover:bg-red-50 active:bg-red-100 [&::-webkit-details-marker]:hidden"
          >
            <span className="sr-only">{nav.menu}</span>
            <span className="pointer-events-none flex flex-col gap-1.5">
              <span className="h-0.5 w-6 rounded bg-current" />
              <span className="h-0.5 w-6 rounded bg-current" />
              <span className="h-0.5 w-6 rounded bg-current" />
            </span>
          </summary>

          <div className="absolute inset-x-0 top-full border-t border-red-100 bg-white px-4 pb-4 shadow-lg shadow-red-100/60">
            <ul className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(lang, link.href)}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-red-50 hover:text-red-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={localePath(lang, "/contact")}
              onClick={closeMenu}
              className="mt-3 block rounded-full bg-red-500 px-5 py-2 text-center text-sm font-bold text-white hover:bg-red-600"
            >
              {nav.cta}
            </Link>
          </div>
        </details>
        </div>
      </nav>
    </header>
  );
}
