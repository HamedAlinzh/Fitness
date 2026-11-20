import { Check, MessageCircle, Phone } from "lucide-react";
import Card from "@/components/ui/Card";
import { COACH_PHONE } from "@/lib/site-contact";
import { whatsappUrl, telUrl } from "@/lib/contact-links";
import { cn } from "@/lib/cn";
import { localizePackage, type PackageData } from "@/lib/packages";
import { getDict, getLocale } from "@/i18n/server";

/**
 * The call to action is direct contact, not the consultation form. Filling in a form is
 * for people who want free advice; someone who has already picked a plan shouldn't be
 * made to answer six questions before they can talk to anyone. Payment happens later,
 * through a link the coach issues by hand (see src/lib/payments.ts).
 */
export default async function PricingCard({ plan: raw }: { plan: PackageData }) {
  const lang = await getLocale();
  const { pricing: t } = await getDict();
  const plan = localizePackage(raw, lang);
  const features = plan.features;
  const message = t.planMessage(plan.title);

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-6 text-start",
        plan.highlighted &&
          "relative border-red-500/70 bg-gradient-to-b from-red-900/40 to-surface shadow-2xl shadow-red-500/20 xl:-my-4 xl:py-10"
      )}
    >
      {plan.highlighted && (
        <span className="w-fit rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-background">
          {t.recommended}
        </span>
      )}
      <div>
        <h3 className="text-lg font-bold text-ink-900">{plan.title}</h3>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className="text-4xl font-black tracking-tight text-ink-900">
            {plan.priceToman.toLocaleString(lang === "fa" ? "fa-IR" : "en-US")}
          </span>
          <span className="text-sm text-ink-500">{t.currency}</span>
          <span className="text-sm text-ink-500">/ {plan.periodLabel}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-3 border-t border-white/[0.06] pt-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-sm text-ink-700"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2">
        <a
          href={whatsappUrl(COACH_PHONE, message)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors",
            plan.highlighted
              ? "bg-red-500 text-background shadow-lg shadow-red-500/30 hover:bg-red-400"
              : "border border-white/15 text-ink-900 hover:border-red-400 hover:text-red-400"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          {t.whatsappForPlan}
        </a>
        <a
          href={telUrl(COACH_PHONE)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:text-red-400"
        >
          <Phone className="h-4 w-4" />
          {t.call}
        </a>
      </div>
    </Card>
  );
}
