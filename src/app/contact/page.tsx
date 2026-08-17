import type { Metadata } from "next";
import { Phone, MapPin, Send } from "lucide-react";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/sections/ContactForm";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "تماس با من | کوچ فیت",
  description: "درخواست مشاوره رایگان و شروع همکاری، حضوری یا آنلاین.",
};

const contactInfo = [
  { icon: Phone, label: "تلفن تماس", value: "به‌زودی تکمیل می‌شود" },
  { icon: Send, label: "پیام مستقیم", value: "از طریق همین فرم" },
  { icon: MapPin, label: "موقعیت باشگاه", value: "شیراز" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تماس با من"
        title="آماده‌ای مسیر جدیدت رو شروع کنی؟"
        description="فرم زیر رو پر کن تا هدفت رو بشنوم و بهترین برنامه رو باهم بچینیم."
      />

      <section className="py-16">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <FadeIn className="flex flex-col gap-4">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-3xl border border-pink-100 bg-white p-5 text-right"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-xs text-ink-500">{item.label}</div>
                  <div className="text-sm font-bold text-ink-900">{item.value}</div>
                </div>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.1}>
            <ContactForm />
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
