import { Star, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { setHighlightedPackage } from "@/lib/actions/packages";
import PackagePriceForm from "@/components/admin/PackagePriceForm";
import { cn } from "@/lib/cn";

export default async function AdminPackagesPage() {
  await requireAdmin();

  const packages = await prisma.package.findMany({
    orderBy: { priceToman: "asc" },
  });

  if (packages.length === 0) {
    return (
      <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
        هنوز پلنی ثبت نشده است. پلن‌ها با <code>npx prisma db seed</code> ساخته
        می‌شوند.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-red-100 bg-white p-6">
        <h2 className="text-base font-bold text-ink-900">قیمت پلن‌ها</h2>
        <p className="mt-1 text-sm leading-7 text-ink-500">
          قیمت هر پلن را همین‌جا عوض کن؛ بلافاصله روی سایت اعمال می‌شود و نیازی به
          انتشار دوباره نیست. مبلغ را به تومان بنویس — جداکننده‌ها مهم نیستند.
        </p>
      </div>

      {packages.map((pkg) => {
        const features: string[] = JSON.parse(pkg.features);

        return (
          <article
            key={pkg.id}
            className={cn(
              "flex flex-col gap-4 rounded-3xl border bg-white p-6",
              pkg.highlighted ? "border-red-400 ring-1 ring-red-200" : "border-red-100"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-ink-900">{pkg.title}</span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                  {pkg.periodLabel}
                </span>
              </div>

              <form action={setHighlightedPackage}>
                <input type="hidden" name="id" value={pkg.id} />
                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                    pkg.highlighted
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border border-red-200 text-red-600 hover:bg-red-50"
                  )}
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill={pkg.highlighted ? "currentColor" : "none"}
                  />
                  {pkg.highlighted ? "پیشنهادی" : "پیشنهادی کن"}
                </button>
              </form>
            </div>

            <p className="text-sm leading-7 text-ink-500">{pkg.description}</p>

            <ul className="flex flex-col gap-1.5">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-ink-500"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="border-t border-red-100 pt-4">
              <PackagePriceForm id={pkg.id} priceToman={pkg.priceToman} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
