import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

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
    <section className="relative isolate overflow-hidden border-b border-white/5">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -z-10 h-80 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-red-500/20 blur-[100px]"
      />
      <Container className="flex flex-col items-center gap-5 py-20 text-center sm:py-24">
        <Badge>{eyebrow}</Badge>
        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink-900 sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm leading-8 text-ink-500 sm:text-base">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
