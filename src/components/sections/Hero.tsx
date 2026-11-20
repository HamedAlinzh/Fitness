import { ArrowLeft, ArrowRight, Dumbbell } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { HERO_IMAGE_SRC, SITE_NAME } from "@/lib/brand";
import { getDict, getLocale } from "@/i18n/server";
import { dirOf, localePath } from "@/i18n/config";

export default async function Hero() {
  const lang = await getLocale();
  const dict = await getDict();
  const { hero, stats } = dict;
  // Points "forward" in reading order: left in Persian, right in English.
  const Arrow = dirOf(lang) === "rtl" ? ArrowLeft : ArrowRight;
  const highlight = stats[1];

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 start-1/2 -z-10 h-[32rem] w-[32rem] rounded-full bg-red-500/20 blur-[120px]"
      />

      {/* Oversized hollow wordmark behind everything. Decorative, so hidden from AT. */}
      <div
        aria-hidden
        dir="ltr"
        className="text-outline pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-60 select-none overflow-hidden whitespace-nowrap text-center text-[18vw] font-black uppercase leading-none tracking-tighter"
      >
        {SITE_NAME.split(" ").at(-1)}
      </div>

      <Container className="grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start gap-7 text-start">
          <Badge>
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            {hero.badge}
          </Badge>

          <h1 className="text-4xl font-black leading-[1.25] tracking-tight text-ink-900 sm:text-6xl sm:leading-[1.2]">
            {hero.title}
          </h1>

          <p className="max-w-lg text-base leading-8 text-ink-500 sm:text-lg">
            {hero.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Button href={localePath(lang, "/contact")}>
              {hero.primary}
              <Arrow className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Button href={localePath(lang, "/gallery")} variant="secondary">
              {hero.secondary}
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          {/* Offset outline frame behind the photo. */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] border-2 border-red-500/60 rtl:-translate-x-4"
          />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-red-500/20">
            <PlaceholderMedia
              icon={Dumbbell}
              variant={3}
              src={HERO_IMAGE_SRC}
              alt={SITE_NAME}
              priority
              sizes="(min-width: 1024px) 448px, 384px"
              className="aspect-[4/5] w-full"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
            />
          </div>

          {highlight && (
            <div className="absolute -bottom-6 start-[-0.75rem] flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/90 px-5 py-4 shadow-xl backdrop-blur sm:start-[-2rem]">
              <span className="text-3xl font-black text-red-400">{highlight.value}</span>
              <span className="max-w-[8rem] text-xs leading-5 text-ink-700">
                {highlight.label}
              </span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
