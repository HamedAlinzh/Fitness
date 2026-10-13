import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import TestimonialCard from "@/components/sections/TestimonialCard";
import TestimonialForm from "@/components/sections/TestimonialForm";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import CTA from "@/components/sections/CTA";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/testimonials">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).testimonials;
  return pageMetadata(lang, "/testimonials", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function TestimonialsPage() {
  const { testimonials: t } = await getDict();
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    // Explicit select so the submitter's phone number can never reach a public page.
    select: {
      id: true,
      studentName: true,
      studentImage: true,
      content: true,
      rating: true,
    },
  });

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <section className="py-16">
        <Container>
          {testimonials.length === 0 ? (
            <p className="text-center text-sm text-ink-500">{t.empty}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <FadeIn key={testimonial.id} delay={(index % 3) * 0.1}>
                  <TestimonialCard testimonial={testimonial} />
                </FadeIn>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pb-16">
        <Container className="flex max-w-2xl flex-col gap-8">
          <SectionHeading
            eyebrow={t.formEyebrow}
            title={t.formTitle}
          />
          <div lang="fa" dir="rtl">
            <TestimonialForm />
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
