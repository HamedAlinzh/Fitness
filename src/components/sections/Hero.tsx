import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/motion/FadeIn";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
      <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />

      <Container className="relative flex flex-col items-center gap-6 py-24 text-center">
        <FadeIn>
          <Badge>مربی بدنسازی و تناسب اندام</Badge>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            بهترین نسخه از خودت رو با یک برنامه اختصاصی بساز
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="max-w-xl text-base leading-8 text-ink-500">
            مربیگری حرفه‌ای، حضوری در شیراز و آنلاین برای سراسر ایران؛ برنامه
            تمرینی اختصاصی، پیگیری روزانه و مشاوره مستقیم.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button href="/contact">شروع مشاوره رایگان</Button>
            <Button href="/gallery" variant="secondary">
              مشاهده گالری تمرینات
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
