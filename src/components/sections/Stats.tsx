import Container from "@/components/ui/Container";
import { getDict } from "@/i18n/server";

export default async function Stats() {
  const { stats } = await getDict();

  return (
    <section className="border-y border-white/5 bg-surface">
      <Container className="grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              "flex flex-col gap-2 px-4 py-10 text-center sm:py-12 " +
              // Hairlines between cells: every cell after the first in its row.
              (index % 2 === 1 ? "border-s border-white/5 " : "") +
              (index >= 2 ? "border-t border-white/5 sm:border-t-0 " : "") +
              (index === 2 ? "sm:border-s " : "")
            }
          >
            <div className="bg-gradient-to-b from-ink-900 to-red-300 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
              {stat.value}
            </div>
            <div className="text-xs leading-5 text-ink-500 sm:text-sm">{stat.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
