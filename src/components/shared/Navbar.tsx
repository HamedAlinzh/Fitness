"use client";

import Link from "next/link";
import { useRef } from "react";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/about", label: "درباره من" },
  { href: "/gallery", label: "گالری" },
  { href: "/pricing", label: "برنامه‌ها" },
  { href: "/testimonials", label: "نظرات" },
  { href: "/blog", label: "بلاگ" },
  { href: "/contact", label: "تماس" },
];

export default function Navbar() {
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
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-red-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white">
            ف
          </span>
          کوچ فیت
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-700 transition-colors hover:text-red-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-red-300 transition-colors hover:bg-red-600 md:inline-block"
        >
          شروع مشاوره
        </Link>

        <details ref={menuRef} className="md:hidden">
          <summary
            aria-label="باز کردن منو"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-ink-700 select-none hover:bg-red-50 active:bg-red-100 [&::-webkit-details-marker]:hidden"
          >
            <span className="sr-only">منو</span>
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
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-red-50 hover:text-red-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="mt-3 block rounded-full bg-red-500 px-5 py-2 text-center text-sm font-bold text-white hover:bg-red-600"
            >
              شروع مشاوره
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
