import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import TestimonialCard from "@/components/sections/TestimonialCard";
import FadeIn from "@/components/motion/FadeIn";
import CTA from "@/components/sections/CTA";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "نظرات شاگردان | کوچ فیت",
  description: "تجربه‌ی شاگردهایی که با برنامه اختصاصی به هدفشون رسیدن.",
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="نظرات شاگردان"
        title="تجربه‌ی کسایی که همراهم بودن"
        description="نتیجه‌ی واقعی همراهی و پیگیری مستمر رو از زبون خود شاگردها بخون."
      />

      <section className="py-16">
        <Container>
          {testimonials.length === 0 ? (
            <p className="text-center text-sm text-ink-500">فعلاً نظری ثبت نشده.</p>
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

      <CTA />
    </>
  );
}
