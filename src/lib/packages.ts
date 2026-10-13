import type { Locale } from "@/i18n/config";

/**
 * The fields of a plan the public site needs, Persian plus the optional English text.
 * No Prisma import: the admin form that edits the English fields is a Client Component.
 */
export type PackageData = {
  id: string;
  title: string;
  priceToman: number;
  periodLabel: string;
  features: string;
  highlighted: boolean;
  titleEn: string;
  periodLabelEn: string;
  featuresEn: string;
};

export type LocalizedPackage = {
  id: string;
  title: string;
  priceToman: number;
  periodLabel: string;
  features: string[];
  highlighted: boolean;
};

export const PACKAGE_EN_LIMITS = {
  title: 120,
  description: 600,
  periodLabel: 60,
  feature: 200,
  features: 12,
} as const;

/** Parses a JSON-encoded string array; anything malformed counts as "no features". */
export function parseFeatures(json: string): string[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "")
      : [];
  } catch {
    return [];
  }
}

/**
 * Each English field falls back to its Persian counterpart when blank, so a plan the
 * coach hasn't translated yet still shows up on /en rather than disappearing. Features
 * are all-or-nothing: a half-translated list would mix the two languages inside one card.
 */
export function localizePackage(
  plan: PackageData,
  lang: Locale
): LocalizedPackage {
  const persianFeatures = parseFeatures(plan.features);
  if (lang === "fa") {
    return {
      id: plan.id,
      title: plan.title,
      priceToman: plan.priceToman,
      periodLabel: plan.periodLabel,
      features: persianFeatures,
      highlighted: plan.highlighted,
    };
  }

  const englishFeatures = parseFeatures(plan.featuresEn);
  return {
    id: plan.id,
    title: plan.titleEn.trim() || plan.title,
    priceToman: plan.priceToman,
    periodLabel: plan.periodLabelEn.trim() || plan.periodLabel,
    features: englishFeatures.length > 0 ? englishFeatures : persianFeatures,
    highlighted: plan.highlighted,
  };
}
