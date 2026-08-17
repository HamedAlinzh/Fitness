"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-pink-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white">
            ف
          </span>
          کوچ فیت
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-700 transition-colors hover:text-pink-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-full bg-pink-500 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-pink-300 transition-colors hover:bg-pink-600 md:inline-block"
        >
          شروع مشاوره
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="باز کردن منو"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-pink-50 md:hidden"
        >
          <span className="sr-only">منو</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 rounded bg-current" />
            <span className="h-0.5 w-6 rounded bg-current" />
            <span className="h-0.5 w-6 rounded bg-current" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-pink-100 bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-pink-50 hover:text-pink-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-pink-500 px-5 py-2 text-center text-sm font-bold text-white hover:bg-pink-600"
          >
            شروع مشاوره
          </Link>
        </div>
      )}
    </header>
  );
}
