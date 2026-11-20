import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getDict, getLocale } from "@/i18n/server";
import { dirOf, localePath } from "@/i18n/config";

export default async function CTA() {
  const lang = await getLocale();
  const { cta } = await getDict();
  const Arrow = dirOf(lang) === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-500 via-red-600 to-red-900 px-6 py-16 sm:px-16 sm:py-20">
          <div aria-hidden className="bg-stripes absolute inset-0" />
          <div
            aria-hidden
            className="absolute -bottom-24 -end-24 h-72 w-72 rounded-full bg-black/30 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-6 text-start md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-4">
              <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
                {cta.title}
              </h2>
              <p className="text-base leading-8 text-white/85">{cta.description}</p>
            </div>
            <Button
              href={localePath(lang, "/contact")}
              variant="light"
              className="shrink-0 shadow-xl shadow-black/20"
            >
              {cta.button}
              <Arrow className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
