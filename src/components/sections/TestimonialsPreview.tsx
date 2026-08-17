import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import TestimonialCard from "@/components/sections/TestimonialCard";
import { prisma } from "@/lib/prisma";

export default async function TestimonialsPreview() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="نظرات شاگردان" title="تجربه‌ی کسایی که همراهم بودن" />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={index * 0.1}>
              <TestimonialCard testimonial={testimonial} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/testimonials" variant="ghost">
            مشاهده همه نظرات ←
          </Button>
        </div>
      </Container>
    </section>
  );
}
