import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "مربی شخصی | برنامه تمرینی و مشاوره ورزشی",
  description:
    "مربیگری حرفه‌ای بدنسازی و تناسب اندام، به صورت حضوری در شیراز و آنلاین در سراسر ایران.",
};

/**
 * Root layout only owns the document shell. The public Navbar/Footer chrome lives in
 * the `(site)` route group so the `/admin` panel can render its own chrome instead.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
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
