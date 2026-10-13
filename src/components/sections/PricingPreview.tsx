import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import PricingCard from "@/components/sections/PricingCard";
import { prisma } from "@/lib/prisma";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

export default async function PricingPreview() {
  const lang = await getLocale();
  const { pricingPreview: t } = await getDict();
  const plans = await prisma.package.findMany({
    orderBy: { priceToman: "asc" },
    take: 3,
  });

  if (plans.length === 0) return null;

  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.id} delay={index * 0.1}>
              <PricingCard plan={plan} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href={localePath(lang, "/pricing")} variant="ghost">
            {t.all}
          </Button>
        </div>
      </Container>
    </section>
  );
}
