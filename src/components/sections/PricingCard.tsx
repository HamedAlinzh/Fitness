import { Check, MessageCircle, Phone } from "lucide-react";
import Card from "@/components/ui/Card";
import { COACH_PHONE } from "@/lib/site-contact";
import { whatsappUrl, telUrl } from "@/lib/contact-links";
import { cn } from "@/lib/cn";

export type PackageData = {
  id: string;
  title: string;
  priceToman: number;
  periodLabel: string;
  features: string;
  highlighted: boolean;
};

/**
 * The call to action is direct contact, not the consultation form. Filling in a form is
 * for people who want free advice; someone who has already picked a plan shouldn't be
 * made to answer six questions before they can talk to anyone. Payment happens later,
 * through a link the coach issues by hand (see src/lib/payments.ts).
 */
export default function PricingCard({ plan }: { plan: PackageData }) {
  const features: string[] = JSON.parse(plan.features);
  const message = `سلام، درباره «${plan.title}» می‌خواستم صحبت کنم.`;

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-6 text-right",
        plan.highlighted && "border-red-400 ring-2 ring-red-300"
      )}
    >
      {plan.highlighted && (
        <span className="w-fit rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          پیشنهادی
        </span>
      )}
      <div>
        <h3 className="text-lg font-bold text-ink-900">{plan.title}</h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-2xl font-extrabold text-red-600">
            {plan.priceToman.toLocaleString("fa-IR")}
          </span>
          <span className="text-sm text-ink-500">تومان</span>
          <span className="text-sm text-ink-500">/ {plan.periodLabel}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-ink-500"
          >
            <Check className="h-4 w-4 shrink-0 text-red-500" />
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
              ? "bg-red-500 text-white shadow-lg shadow-red-300/60 hover:bg-red-600"
              : "border border-red-200 text-red-600 hover:bg-red-50"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          واتساپ برای این پلن
        </a>
        <a
          href={telUrl(COACH_PHONE)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Phone className="h-4 w-4" />
          تماس تلفنی
        </a>
      </div>
    </Card>
  );
}
