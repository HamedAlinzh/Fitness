import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import PricingCard, {
  type PackageData,
} from "@/components/sections/PricingCard";
import FadeIn from "@/components/motion/FadeIn";
import { COACH_PHONE } from "@/lib/site-contact";
import { whatsappUrl } from "@/lib/contact-links";

/**
 * Replaces the old online/in-person tab switcher. Every plan is online now — in-person
 * coaching in Shiraz is arranged by message instead of being sold as a package — so the
 * tabs had nothing left to switch between.
 *
 * Dropping them also removed a JS dependency: the tabs were React state, so a visitor
 * whose JS hadn't run (or hadn't finished hydrating) could only ever see the first tab's
 * plans, with the rest unreachable. Same class of bug as the consultation form's "next"
 * button; see the note in CLAUDE.md.
 */
export default function PricingPlans({ plans }: { plans: PackageData[] }) {
  const inPersonMessage =
    "سلام، درباره مربیگری حضوری در شیراز می‌خواستم صحبت کنم.";

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        {plans.length === 0 ? (
          <p className="text-center text-sm text-ink-500">
            فعلاً پلنی ثبت نشده است.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => (
              <FadeIn key={plan.id} delay={index * 0.1}>
                <PricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        )}

        <p className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl bg-red-50/60 px-6 py-4 text-center text-sm leading-7 text-ink-700">
          <MapPin className="h-4 w-4 shrink-0 text-red-500" />
          برای مربیگری <span className="font-bold">حضوری در شیراز</span> پلن ثابتی
          تعریف نشده —{" "}
          <a
            href={whatsappUrl(COACH_PHONE, inPersonMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-red-600 underline underline-offset-4 hover:text-red-700"
          >
            پیام بده
          </a>{" "}
          تا باهم هماهنگ کنیم.
        </p>
      </Container>
    </section>
  );
}
