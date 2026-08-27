import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | مربی شخصی، برنامه تمرینی و مشاوره ورزشی`,
  description: SITE_TAGLINE,
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
