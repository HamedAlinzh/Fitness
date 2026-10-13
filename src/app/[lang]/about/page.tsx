import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict, getLocale } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Sparkles, GraduationCap, Users2, MapPinned, MessageSquareHeart } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import FadeIn from "@/components/motion/FadeIn";
import CTA from "@/components/sections/CTA";
import { aboutParagraphs } from "@/lib/about";
import { getAboutContent } from "@/lib/about-content";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).about;
  return pageMetadata(lang, "/about", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

const reasonIcons = [GraduationCap, Users2, MapPinned, MessageSquareHeart];

export default async function AboutPage() {
  // Copy and photo are edited from /admin/about; the "چرا با من تمرین کنی؟" cards above
  // are fixed, since they describe how the coaching works rather than the coach.
  const lang = await getLocale();
  const { about: t } = await getDict();
  const about = await getAboutContent(lang);

  return (
    <>
      <PageHeader eyebrow={about.eyebrow} title={about.heading} />

      <section className="py-16">
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

          <FadeIn delay={0.15} className="flex flex-col gap-4 text-start">
            {aboutParagraphs(about.bodyText).map((paragraph) => (
              <p key={paragraph} className="leading-8 text-ink-500">
                {paragraph}
              </p>
            ))}
          </FadeIn>
        </Container>
      </section>

      <section className="bg-red-50/60 py-20">
        <Container className="flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
              {t.whyTitle}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {t.reasons.map((reason, index) => {
            const Icon = reasonIcons[index];
            return (
              <FadeIn key={reason.title} delay={index * 0.1}>
                <div className="flex items-start gap-4 rounded-3xl border border-red-100 bg-white p-6 text-start">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink-900">{reason.title}</h3>
                    <ul className="mt-2 list-disc space-y-1 ps-5 text-sm leading-7 text-ink-500 marker:text-red-400">
                      {reason.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
