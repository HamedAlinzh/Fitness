import { CalendarDays, CalendarRange, Eye, Info } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import {
  getAnalyticsSummary,
  getDailyStats,
  getMonthlyStats,
  getTopPaths,
} from "@/lib/analytics";
import StatBarList from "@/components/admin/StatBarList";

// Counting is live; a cached render would show yesterday's numbers.
export const dynamic = "force-dynamic";

const DAYS = 30;
const MONTHS = 12;

/** Persian names for the public routes, so the table doesn't read as raw URLs. */
const PATH_LABELS: Record<string, string> = {
  "/": "صفحه‌ی اصلی",
  "/about": "درباره من",
  "/gallery": "گالری",
  "/pricing": "پلن‌ها و قیمت",
  "/blog": "مقاله‌ها",
  "/testimonials": "نظرات",
  "/contact": "مشاوره و تماس",
  "/pay/[token]": "صفحه‌ی پرداخت",
};

function labelForPath(path: string) {
  if (PATH_LABELS[path]) return PATH_LABELS[path];
  if (path.startsWith("/blog/")) return `مقاله: ${path.slice("/blog/".length)}`;
  return path;
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [summary, daily, monthly, topPaths] = await Promise.all([
    getAnalyticsSummary(),
    getDailyStats(DAYS),
    getMonthlyStats(MONTHS),
    getTopPaths(DAYS),
  ]);

  const cards = [
    {
      icon: CalendarDays,
      title: "امروز",
      hint: summary.dayLabel,
      views: summary.today.views,
      visitors: summary.today.visitors,
    },
    {
      icon: CalendarRange,
      title: "این ماه",
      hint: summary.monthLabel,
      views: summary.month.views,
      visitors: summary.month.visitors,
    },
  ];

  const hasData = summary.allTimeViews > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-3xl border border-red-100 bg-white p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <card.icon className="h-5 w-5" />
            </span>
            <div>
              <span className="text-sm font-semibold text-ink-700">
                {card.title}
              </span>
              <span className="block text-xs text-ink-500">{card.hint}</span>
            </div>
            <div className="flex items-end gap-6">
              <span className="flex flex-col">
                <span className="text-3xl font-extrabold text-ink-900">
                  {card.views.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-ink-500">بازدید</span>
              </span>
              <span className="flex flex-col">
                <span className="text-3xl font-extrabold text-red-600">
                  {card.visitors.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-ink-500">نفر</span>
              </span>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3 rounded-3xl border border-red-100 bg-white p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Eye className="h-5 w-5" />
          </span>
          <div>
            <span className="text-sm font-semibold text-ink-700">
              مجموع بازدیدها
            </span>
            <span className="block text-xs text-ink-500">از ابتدای شمارش</span>
          </div>
          <span className="text-3xl font-extrabold text-ink-900">
            {summary.allTimeViews.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>

      {!hasData && (
        <p className="flex items-start gap-2 rounded-2xl border border-red-100 bg-white p-4 text-sm leading-7 text-ink-500">
          <Info className="mt-1 h-4 w-4 shrink-0 text-red-500" />
          شمارش بازدیدها تازه فعال شده و هنوز چیزی ثبت نشده است. اعداد از همین حالا به
          بعد جمع می‌شوند و بازدیدهای قبلی قابل بازیابی نیستند.
        </p>
      )}

      <section className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6">
        <h2 className="text-base font-bold text-ink-900">
          بازدید روزانه ({DAYS.toLocaleString("fa-IR")} روز اخیر)
        </h2>
        <StatBarList buckets={daily} labelWidthClass="w-24 sm:w-32" />
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6">
        <h2 className="text-base font-bold text-ink-900">
          بازدید ماهانه ({MONTHS.toLocaleString("fa-IR")} ماه اخیر)
        </h2>
        <StatBarList buckets={monthly} labelWidthClass="w-24 sm:w-32" />
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6">
        <h2 className="text-base font-bold text-ink-900">
          پربازدیدترین صفحه‌ها ({DAYS.toLocaleString("fa-IR")} روز اخیر)
        </h2>

        {topPaths.length === 0 ? (
          <p className="text-sm text-ink-500">هنوز بازدیدی ثبت نشده است.</p>
        ) : (
          // The three columns fit a phone unaided; the scroller is only a safety net for
          // an unusually long page title.
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="pb-2 font-medium">صفحه</th>
                  <th className="pb-2 font-medium">بازدید</th>
                  <th className="pb-2 font-medium">افراد</th>
                </tr>
              </thead>
              <tbody>
                {topPaths.map((row) => (
                  <tr key={row.path} className="border-t border-red-50">
                    <td className="py-2.5 font-semibold text-ink-700">
                      {labelForPath(row.path)}
                    </td>
                    <td className="py-2.5 tabular-nums text-ink-700">
                      {row.views.toLocaleString("fa-IR")}
                    </td>
                    <td className="py-2.5 tabular-nums font-semibold text-red-600">
                      {row.visitors.toLocaleString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-2xl border border-red-100 bg-white p-4 text-xs leading-7 text-ink-500">
        <Info className="mt-1 h-4 w-4 shrink-0 text-red-500" />
        «بازدید» یعنی تعداد دفعات باز شدن صفحه‌ها و «افراد» یعنی تعداد بازدیدکننده‌های
        متفاوت در همان بازه؛ یک نفر که در یک روز پنج صفحه ببیند، پنج بازدید است و یک نفر.
        شمارش روی سرور خودمان انجام می‌شود و هیچ آدرس IP ذخیره نمی‌شود؛ ربات‌ها و
        خزنده‌های موتور جست‌وجو هم شمرده نمی‌شوند.
      </p>
    </div>
  );
}
