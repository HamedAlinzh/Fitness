import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import { getDict } from "@/i18n/server";

export default async function PricingFaq() {
  const { faq } = (await getDict()).pricing;

  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {faq.items.map((faq, index) => (
            <FadeIn key={faq.question} delay={index * 0.1}>
              <div className="rounded-2xl border border-red-100 bg-white p-6 text-start">
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
