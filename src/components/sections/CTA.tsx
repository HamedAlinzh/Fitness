import { MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";

export default function CTA() {
  return (
    <section className="py-20">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-pink-700 px-6 py-16 text-center sm:px-16">
            <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <MessageCircle className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <h2 className="max-w-xl text-3xl font-extrabold text-white sm:text-4xl">
                آماده‌ای مسیر جدیدت رو شروع کنی؟
              </h2>
              <p className="max-w-md text-sm leading-7 text-pink-50">
                یه پیام بفرست تا هدفت رو بشنوم و بهترین برنامه رو باهم بچینیم؛
                حضوری در شیراز یا آنلاین از هر جای ایران.
              </p>
              <Button href="/contact" variant="light">
                رزرو مشاوره رایگان
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
