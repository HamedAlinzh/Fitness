import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import PricingCard from "@/components/sections/PricingCard";
import { prisma } from "@/lib/prisma";

export default async function PricingPreview() {
  const plans = await prisma.package.findMany({
    orderBy: { priceToman: "asc" },
    take: 3,
  });

  if (plans.length === 0) return null;

  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="پلن‌ها و قیمت‌گذاری"
          title="پلنی که مناسب خودته رو انتخاب کن"
          description="همه پلن‌ها آنلاین و برای شاگردان داخل و خارج از کشور است؛ مربیگری حضوری در شیراز جداگانه هماهنگ می‌شود."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.id} delay={index * 0.1}>
              <PricingCard plan={plan} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/pricing" variant="ghost">
            مشاهده همه پلن‌ها ←
          </Button>
        </div>
      </Container>
    </section>
  );
}
