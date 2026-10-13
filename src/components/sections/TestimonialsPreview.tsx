import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import TestimonialCard from "@/components/sections/TestimonialCard";
import { prisma } from "@/lib/prisma";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

export default async function TestimonialsPreview() {
  const lang = await getLocale();
  const { testimonialsPreview: t } = await getDict();
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    // Explicit select so the submitter's phone number can never reach a public page.
    select: {
      id: true,
      studentName: true,
      studentImage: true,
      content: true,
      rating: true,
    },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={index * 0.1}>
              <TestimonialCard testimonial={testimonial} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href={localePath(lang, "/testimonials")} variant="ghost">
            {t.all}
          </Button>
        </div>
      </Container>
    </section>
  );
}
