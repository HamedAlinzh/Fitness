import { Dumbbell, Salad, Video, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import { getDict } from "@/i18n/server";

const icons = [Dumbbell, Salad, Video, MapPin];

export default async function Services() {
  const { services } = await getDict();

  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service, index) => {
            const Icon = icons[index];
            return (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card className="flex h-full flex-col items-start gap-4 text-start">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="text-lg font-bold text-ink-900">{service.title}</h3>
                <p className="text-sm leading-7 text-ink-500">
                  {service.description}
                </p>
              </Card>
            </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
