import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import PricingPlans from "@/components/sections/PricingPlans";
import PricingFaq from "@/components/sections/PricingFaq";
import ContactBand from "@/components/sections/ContactBand";
import CTA from "@/components/sections/CTA";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "پلن‌ها و قیمت‌گذاری | کوچ فیت",
  description:
    "پلن‌های مربیگری آنلاین برای شاگردان داخل و خارج از کشور؛ نیمه‌خصوصی، VIP و کلاس گروهی.",
};

// Prices are edited from /admin/packages, so a change has to show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await prisma.package.findMany({
    orderBy: { priceToman: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="پلن‌ها"
        title="پلنی که مناسب هدفته رو انتخاب کن"
        description="همه پلن‌ها آنلاین هستند و برای شاگردان داخل و خارج از کشور برگزار می‌شوند."
      />
      <PricingPlans plans={plans} />
      <ContactBand />
      <PricingFaq />
      <CTA />
    </>
  );
}
