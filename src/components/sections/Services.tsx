import { Dumbbell, Salad, Video, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getDict } from "@/i18n/server";

const icons = [Dumbbell, Salad, Video, MapPin];

export default async function Services() {
  const { services } = await getDict();

  return (
    <section className="relative py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
          align="start"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={service.title}
                className="reveal group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface p-7 text-start transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40"
              >
                <span
                  aria-hidden
                  dir="ltr"
                  className="text-outline absolute -top-3 end-3 text-7xl font-black leading-none transition-colors group-hover:[-webkit-text-stroke-color:rgb(254_93_159/0.6)]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-background shadow-lg shadow-red-500/30">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="text-lg font-bold text-ink-900">{service.title}</h3>
                <p className="text-sm leading-7 text-ink-500">{service.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
