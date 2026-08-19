import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import PricingTabs from "@/components/sections/PricingTabs";
import PricingFaq from "@/components/sections/PricingFaq";
import CTA from "@/components/sections/CTA";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "پلن‌ها و قیمت‌گذاری | کوچ فیت",
  description: "پلن‌های مربیگری آنلاین و حضوری در شیراز.",
};

export default async function PricingPage() {
  const [onlinePlans, inPersonPlans] = await Promise.all([
    prisma.package.findMany({ where: { type: "ONLINE" }, orderBy: { price: "asc" } }),
    prisma.package.findMany({ where: { type: "IN_PERSON" }, orderBy: { price: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="پلن‌ها"
        title="پلنی که مناسب هدفته رو انتخاب کن"
        description="چه آنلاین از هر جای ایران، چه حضوری در شیراز؛ هر پلن رو می‌تونیم متناسب با شرایطت تنظیم کنیم."
      />
      <PricingTabs onlinePlans={onlinePlans} inPersonPlans={inPersonPlans} />
      <PricingFaq />
      <CTA />
    </>
  );
}
