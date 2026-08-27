import type { Bucket } from "@/lib/analytics";

/**
 * One horizontal bar per period: a light bar for visits with the (always smaller)
 * people count drawn over it from the same baseline, since every person is at least one
 * visit — the overlap *is* the relationship between the two numbers.
 *
 * Deliberately plain HTML with inline widths and no client component: the panel is read
 * on a phone over a slow connection, and a chart that needs JavaScript to appear is the
 * same failure mode the public site was fixed for. The exact numbers sit beside every
 * bar, so nothing depends on judging a length — which is also what discharges the
 * low-contrast warning on the lighter of the two fills.
 */
export default function StatBarList({
  buckets,
  labelWidthClass = "w-28",
}: {
  buckets: Bucket[];
  labelWidthClass?: string;
}) {
  // A shared scale across every row, so bars are comparable down the column. Falls back
  // to 1 so an all-zero period renders empty tracks instead of dividing by zero.
  const max = Math.max(1, ...buckets.map((bucket) => bucket.views));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-4 pb-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          بازدید
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          افراد
        </span>
      </div>

      {buckets.map((bucket) => (
        <div key={bucket.key} className="flex items-center gap-3">
          <span
            className={`${labelWidthClass} shrink-0 text-xs text-ink-500`}
          >
            {bucket.label}
          </span>

          <span className="relative h-6 flex-1 overflow-hidden rounded-md bg-red-50">
            <span
              className="absolute inset-y-0 start-0 rounded-md bg-red-300"
              style={{ width: `${(bucket.views / max) * 100}%` }}
            />
            {/* A ring in the surface colour keeps the two fills from reading as one
                shape where they meet. */}
            <span
              className="absolute inset-y-0 start-0 rounded-md bg-red-500 ring-2 ring-white"
              style={{ width: `${(bucket.visitors / max) * 100}%` }}
            />
          </span>

          <span className="flex shrink-0 items-baseline gap-2 text-xs font-semibold tabular-nums">
            <span className="w-10 text-start text-ink-700">
              {bucket.views.toLocaleString("fa-IR")}
            </span>
            <span className="w-10 text-start text-red-600">
              {bucket.visitors.toLocaleString("fa-IR")}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
