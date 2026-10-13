import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import PricingPlans from "@/components/sections/PricingPlans";
import PricingFaq from "@/components/sections/PricingFaq";
import ContactBand from "@/components/sections/ContactBand";
import CTA from "@/components/sections/CTA";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).pricing;
  return pageMetadata(lang, "/pricing", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

// Prices are edited from /admin/packages, so a change has to show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { pricing: t } = await getDict();
  const plans = await prisma.package.findMany({
    orderBy: { priceToman: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <PricingPlans plans={plans} />
      <ContactBand />
      <PricingFaq />
      <CTA />
    </>
  );
}
