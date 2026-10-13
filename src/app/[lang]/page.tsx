import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import AboutPreview from "@/components/sections/AboutPreview";
import Services from "@/components/sections/Services";
import GalleryPreview from "@/components/sections/GalleryPreview";
import PricingPreview from "@/components/sections/PricingPreview";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import BlogPreview from "@/components/sections/BlogPreview";
import InstagramFeed from "@/components/sections/InstagramFeed";
import CTA from "@/components/sections/CTA";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  // Title and description come from the layout; only the language alternates are added.
  return { alternates: pageMetadata(lang, "/", { title: "", description: "" }).alternates };
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <AboutPreview />
      <Services />
      <GalleryPreview />
      <PricingPreview />
      <TestimonialsPreview />
      <BlogPreview />
      <InstagramFeed />
      <CTA />
    </>
  );
}
