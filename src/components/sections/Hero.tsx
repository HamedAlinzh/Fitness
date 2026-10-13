import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/motion/FadeIn";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

export default async function Hero() {
  const lang = await getLocale();
  const { hero } = await getDict();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-200/50 blur-3xl" />
      <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-red-300/40 blur-3xl" />

      <Container className="relative flex flex-col items-center gap-6 py-24 text-center">
        <FadeIn mode="mount">
          <Badge>{hero.badge}</Badge>
        </FadeIn>
        <FadeIn mode="mount" delay={0.06}>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            {hero.title}
          </h1>
        </FadeIn>
        <FadeIn mode="mount" delay={0.12}>
          <p className="max-w-xl text-base leading-8 text-ink-500">
            {hero.description}
          </p>
        </FadeIn>
        <FadeIn mode="mount" delay={0.18}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button href={localePath(lang, "/contact")}>{hero.primary}</Button>
            <Button href={localePath(lang, "/gallery")} variant="secondary">
              {hero.secondary}
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
