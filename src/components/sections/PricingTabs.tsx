"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import PricingCard, { type PackageData } from "@/components/sections/PricingCard";
import FadeIn from "@/components/motion/FadeIn";
import { cn } from "@/lib/cn";

export default function PricingTabs({
  onlinePlans,
  inPersonPlans,
}: {
  onlinePlans: PackageData[];
  inPersonPlans: PackageData[];
}) {
  const tabs = [
    { key: "online", label: "آنلاین", plans: onlinePlans },
    { key: "in-person", label: "حضوری در شیراز", plans: inPersonPlans },
  ] as const;

  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("online");
  const activeTab = tabs.find((tab) => tab.key === active)!;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-bold transition-colors",
                active === tab.key
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab.plans.length === 0 ? (
          <p className="text-center text-sm text-ink-500">فعلاً پلنی برای این بخش ثبت نشده.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {activeTab.plans.map((plan, index) => (
              <FadeIn key={plan.id} delay={index * 0.1}>
                <PricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
