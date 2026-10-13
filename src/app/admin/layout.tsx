import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "../globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

/**
 * The admin panel is a separate root layout from the public site (`app/[lang]/layout.tsx`):
 * it is Persian-only and sits outside the `[lang]` segment, so it needs its own document
 * shell. Persian is the coach's working language, so it is never translated.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
