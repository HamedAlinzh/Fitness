import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Vazirmatn } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ViewPixel from "@/components/analytics/ViewPixel";
import LanguageSuggestion from "@/components/shared/LanguageSuggestion";
import { SITE_NAME } from "@/lib/brand";
import { LOCALES, dirOf, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/i18n/metadata";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: `${SITE_NAME} | ${dict.meta.siteTitle}`,
    description: dict.meta.tagline,
  };
}

/**
 * Root layout of the public site, and the only place `lang`/`dir` are set. The public
 * chrome lives here rather than in a route group because `[lang]` is the root segment;
 * the `/admin` panel has its own root layout.
 */
export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
        {lang === "fa" && <LanguageSuggestion />}
        {/* Public pages only — the admin panel has its own layout and is never counted. */}
        <ViewPixel />
      </body>
    </html>
  );
}
