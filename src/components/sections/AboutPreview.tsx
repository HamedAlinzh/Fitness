import { Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import FadeIn from "@/components/motion/FadeIn";

export default function AboutPreview() {
  return (
    <section className="py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <FadeIn>
          <PlaceholderMedia
            icon={Sparkles}
            variant={1}
            className="aspect-[4/5] w-full rounded-[2.5rem]"
          />
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col items-start gap-4 text-right">
          <span className="text-sm font-bold text-red-600">درباره من</span>
          <h2 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">
            مربی‌ای که کنارت می‌مونه، نه فقط یک برنامه تمرینی می‌ده
          </h2>
          <p className="leading-8 text-ink-500">
            چند سالیه که در باشگاه‌های شیراز مربیگری می‌کنم و برای شاگردهام برنامه‌ی
            تمرینی و تغذیه‌ی کاملاً اختصاصی می‌نویسم. چه بخوای حضوری تمرین کنی چه
            آنلاین از هر جای ایران همراهت باشم، مسیر رو قدم‌به‌قدم با هم می‌ریم جلو.
          </p>
          <Button href="/about" variant="ghost">
            بیشتر درباره من بدان ←
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
