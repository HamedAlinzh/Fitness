import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import { getDict } from "@/i18n/server";

export default async function Stats() {
  const { stats } = await getDict();

  return (
    <section className="border-y border-red-100 bg-white">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 0.08} className="text-center">
            <div className="text-2xl font-extrabold text-red-600 sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-ink-500 sm:text-sm">{stat.label}</div>
          </FadeIn>
        ))}
      </Container>
    </section>
  );
}
