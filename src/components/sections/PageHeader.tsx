import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/motion/FadeIn";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-red-100 bg-red-50/60">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-red-200/50 blur-3xl" />
      <Container className="relative flex flex-col items-center gap-4 py-16 text-center">
        <FadeIn mode="mount">
          <Badge>{eyebrow}</Badge>
        </FadeIn>
        <FadeIn mode="mount" delay={0.06}>
          <h1 className="max-w-2xl text-3xl font-extrabold text-ink-900 sm:text-4xl">
            {title}
          </h1>
        </FadeIn>
        {description && (
          <FadeIn mode="mount" delay={0.12}>
            <p className="max-w-xl text-sm leading-8 text-ink-500 sm:text-base">
              {description}
            </p>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}
