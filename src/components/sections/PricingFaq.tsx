import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";

const faqs = [
  {
    question: "تفاوت پلن آنلاین و حضوری چیه؟",
    answer:
      "پلن آنلاین شامل برنامه تمرینی، پیگیری و ارتباط از راه دور است؛ پلن حضوری فقط برای شاگردهای شیراز است و شامل جلسات باشگاهی با نظارت مستقیم می‌شود.",
  },
  {
    question: "آیا امکان تغییر پلن در طول ماه هست؟",
    answer: "بله، هر زمان بخوای می‌تونیم پلن رو متناسب با شرایط و هدفت تغییر بدیم.",
  },
  {
    question: "پرداخت چطور انجام میشه؟",
    answer: "پرداخت آنلاین از طریق درگاه امن به‌زودی در سایت فعال می‌شود؛ فعلاً از طریق فرم تماس هماهنگ می‌کنیم.",
  },
];

export default function PricingFaq() {
  return (
    <section className="bg-pink-50/60 py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="سوالات متداول" title="قبل از انتخاب پلن بخون" />

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {faqs.map((faq, index) => (
            <FadeIn key={faq.question} delay={index * 0.1}>
              <div className="rounded-2xl border border-pink-100 bg-white p-6 text-right">
                <h3 className="text-sm font-bold text-ink-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-500">{faq.answer}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
