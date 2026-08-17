import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type PackageData = {
  id: string;
  title: string;
  price: number;
  periodLabel: string;
  features: string;
  highlighted: boolean;
};

export default function PricingCard({ plan }: { plan: PackageData }) {
  const features: string[] = JSON.parse(plan.features);

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-6 text-right",
        plan.highlighted && "border-pink-400 ring-2 ring-pink-300"
      )}
    >
      {plan.highlighted && (
        <span className="w-fit rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
          پیشنهادی
        </span>
      )}
      <div>
        <h3 className="text-lg font-bold text-ink-900">{plan.title}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-pink-600">
            {plan.price.toLocaleString("fa-IR")}
          </span>
          <span className="text-sm text-ink-500">هزار تومان / {plan.periodLabel}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-ink-500">
            <Check className="h-4 w-4 shrink-0 text-pink-500" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        href="/contact"
        variant={plan.highlighted ? "primary" : "secondary"}
        className="mt-auto w-full"
      >
        درخواست این پلن
      </Button>
    </Card>
  );
}
