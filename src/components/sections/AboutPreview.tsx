import { Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import FadeIn from "@/components/motion/FadeIn";
import { getAboutContent } from "@/lib/about-content";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

/**
 * The homepage teaser for "درباره من". Copy and photo come from the single
 * `AboutContent` row so this and the /about page can't drift apart — both are edited
 * from /admin/about.
 */
export default async function AboutPreview() {
  const lang = await getLocale();
  const dict = await getDict();
  const about = await getAboutContent(lang);

  return (
    <section className="py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <FadeIn>
          <PlaceholderMedia
            icon={Sparkles}
            variant={1}
            src={about.image}
            alt={about.heading}
            className="aspect-[4/5] w-full rounded-[2.5rem]"
          />
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col items-start gap-4 text-start">
          <span className="text-sm font-bold text-red-600">{about.eyebrow}</span>
          <h2 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">
            {about.heading}
          </h2>
          <p className="leading-8 text-ink-500">{about.previewText}</p>
          <Button href={localePath(lang, "/about")} variant="ghost">
            {dict.more}
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
