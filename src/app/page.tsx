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
