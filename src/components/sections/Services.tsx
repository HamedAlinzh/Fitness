import { Dumbbell, Salad, Video, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";

const services = [
  {
    icon: Dumbbell,
    title: "برنامه تمرینی اختصاصی",
    description: "طراحی برنامه بر اساس هدف، سطح و امکانات تمرینی خودت.",
  },
  {
    icon: Salad,
    title: "مشاوره تغذیه",
    description: "رژیم غذایی متناسب با برنامه تمرینی برای نتیجه بهتر.",
  },
  {
    icon: Video,
    title: "مربیگری آنلاین",
    description: "پیگیری روزانه، اصلاح حرکات و ارتباط مستقیم از هر شهری.",
  },
  {
    icon: MapPin,
    title: "مربیگری حضوری در شیراز",
    description: "تمرین حضوری در باشگاه با نظارت مستقیم و اصلاح تکنیک.",
  },
];

export default function Services() {
  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="خدمات"
          title="هر چی برای رسیدن به هدفت لازم داری"
          description="از برنامه تمرینی تا تغذیه و پیگیری روزانه، همه‌چیز زیر یک سقف."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card className="flex h-full flex-col items-start gap-4 text-right">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <service.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="text-lg font-bold text-ink-900">{service.title}</h3>
                <p className="text-sm leading-7 text-ink-500">
                  {service.description}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
