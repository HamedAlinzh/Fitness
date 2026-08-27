import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * First-party visit counting for the public site.
 *
 * ## Why this exists at all instead of a hosted analytics script
 *
 * Google Analytics, Plausible Cloud and friends are the obvious answer everywhere else,
 * but this site's audience is largely inside Iran: those scripts are either blocked from
 * there or block Iranian IPs themselves, so for most real visitors the script never
 * loads and the numbers would be quietly wrong. The counting therefore happens on our
 * own server, next to the SQLite file the rest of the site already uses.
 *
 * ## Why a pixel and not a script
 *
 * The counter is a 1×1 image (`/px`, see src/app/px/route.ts) embedded in the public
 * layout, not a `<script>`. An `<img>` is fetched by the browser with no JavaScript
 * involved, so visits are still counted for someone whose JS is blocked, is still
 * downloading, or failed — the same reason the consultation form's stepper is CSS-only.
 * It also means pages can stay statically rendered: the HTML is identical for everyone
 * and only the pixel request is dynamic.
 *
 * ## Privacy
 *
 * No IP address is ever written to the database. `visitorHash` is an HMAC of
 * IP + User-Agent under a secret salt that is re-derived every calendar month, which is
 * what makes it impossible to follow one person across months, and what makes
 * COUNT(DISTINCT visitorHash) a correct "how many people" figure for a day inside that
 * month *and* for the month as a whole. (A daily-rotating salt — the stricter, common
 * choice — would make the monthly figure count one returning person once per day.)
 *
 * ## Dates are Jalali, in Tehran time
 *
 * `day` and `month` are stored as pre-computed Jalali strings ("1405-06-05", "1405-06")
 * rather than derived from `createdAt` at query time. SQLite's date functions are
 * UTC-only and know nothing about the Persian calendar, so grouping on the timestamp
 * would both put Tehran's evening traffic on the previous day and split a Persian month
 * across two buckets — neither of which matches what "بازدید روزانه/ماهانه" means to the
 * person reading the panel.
 */

/** Rows older than this are pruned; long enough for a year-over-year comparison. */
const RETENTION_DAYS = 400;

const MAX_PATH_LENGTH = 200;

export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const jalaliParts = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** `{ day: "1405-06-05", month: "1405-06" }` — both sort correctly as plain strings. */
export function jalaliKeys(date: Date = new Date()): {
  day: string;
  month: string;
} {
  const parts = jalaliParts.formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const month = `${get("year")}-${get("month")}`;
  return { day: `${month}-${get("day")}`, month };
}

/** The last `count` Jalali day keys, newest first. */
export function recentDayKeys(count: number): string[] {
  const keys: string[] = [];
  const now = Date.now();

  for (let i = 0; keys.length < count; i += 1) {
    const key = jalaliKeys(new Date(now - i * 86_400_000)).day;
    // Iran has no DST (abolished in 2022), so a 24h step never repeats a day — but a
    // duplicate would silently double a bucket, so guard rather than assume.
    if (key !== keys[keys.length - 1]) keys.push(key);
  }

  return keys;
}

/**
 * The last `count` Jalali month keys, newest first. Pure string arithmetic: a Jalali
 * year always has exactly 12 months, so no date maths is needed.
 */
export function recentMonthKeys(count: number): string[] {
  const [startYear, startMonth] = jalaliKeys().month.split("-").map(Number);
  const keys: string[] = [];

  let year = startYear;
  let month = startMonth;

  for (let i = 0; i < count; i += 1) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }

  return keys;
}

/** `"1405-06-05"` → `"۵ شهریور ۱۴۰۵"`. */
export function formatDayKey(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const name = JALALI_MONTH_NAMES[month - 1] ?? "";
  return `${day.toLocaleString("fa-IR")} ${name} ${year.toLocaleString("fa-IR", { useGrouping: false })}`;
}

/** `"1405-06"` → `"شهریور ۱۴۰۵"`. */
export function formatMonthKey(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const name = JALALI_MONTH_NAMES[month - 1] ?? "";
  return `${name} ${year.toLocaleString("fa-IR", { useGrouping: false })}`;
}

/**
 * Salt for the visitor hash. Analytics must never be the thing that takes the site
 * down, so unlike the session secret this never throws — it falls back to a per-process
 * random value, which at worst over-counts people after a restart.
 */
let devSalt: string | undefined;

function saltFor(monthKey: string): string {
  const secret =
    process.env.ANALYTICS_SALT ?? process.env.ADMIN_SESSION_SECRET ?? undefined;

  if (!secret) devSalt ??= randomBytes(32).toString("hex");

  return `${secret ?? devSalt}:${monthKey}`;
}

/**
 * A stable-for-one-month, non-reversible id for a visitor. The IP is used only as HMAC
 * input here and is never returned or stored.
 */
export function visitorHashFor(
  ip: string,
  userAgent: string,
  monthKey: string
): string {
  return createHmac("sha256", saltFor(monthKey))
    .update(`${ip}|${userAgent}`)
    .digest("base64url")
    .slice(0, 32);
}

/**
 * Behind nginx on the VPS the client address arrives in `x-forwarded-for`; the first
 * entry is the original client. Falls back to a constant so a missing header groups
 * those visits together rather than counting each hit as a new person.
 */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|preview|monitor|curl|wget|python-requests|axios|okhttp/i;

export function looksLikeBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/**
 * Turns the referring page URL into the path to store. Payment links are collapsed to
 * `/pay/[token]` — the token is the authorization for that invoice, so it must not end
 * up sitting in an analytics table.
 */
export function normalizePath(pathname: string): string {
  let path = pathname.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) return "/";

  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  if (path.startsWith("/pay/")) path = "/pay/[token]";

  return path.slice(0, MAX_PATH_LENGTH);
}

/** Paths that are never counted, even if something forges a referer pointing at them. */
function isCountable(path: string): boolean {
  return !path.startsWith("/admin") && path !== "/px";
}

export type RecordResult = "counted" | "skipped";

/**
 * Writes one page view. Callers are expected to swallow nothing — this function itself
 * never throws, because a counting failure must not turn into a broken image (or worse,
 * a 500) on a real page.
 */
export async function recordPageView(request: Request): Promise<RecordResult> {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (looksLikeBot(userAgent)) return "skipped";

    const referer = request.headers.get("referer");
    if (!referer) return "skipped";

    let refererUrl: URL;
    try {
      refererUrl = new URL(referer);
    } catch {
      return "skipped";
    }

    // Only count our own pages: the pixel URL is public and someone else's page could
    // otherwise inject rows for arbitrary paths.
    const host = request.headers.get("host");
    if (host && refererUrl.host !== host) return "skipped";

    const path = normalizePath(refererUrl.pathname);
    if (!isCountable(path)) return "skipped";

    const { day, month } = jalaliKeys();
    const ip = clientIpFrom(request.headers);

    await prisma.pageView.create({
      data: {
        path,
        day,
        month,
        visitorHash: visitorHashFor(ip, userAgent, month),
      },
    });

    await maybePruneOldViews();
    return "counted";
  } catch {
    return "skipped";
  }
}

/**
 * Opportunistic retention. Runs on roughly one request in a hundred rather than on a
 * schedule, because the deployment is a single VPS with no cron worker to hang a job on.
 */
async function maybePruneOldViews() {
  if (Math.random() >= 0.01) return;

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
  await prisma.pageView
    .deleteMany({ where: { createdAt: { lt: cutoff } } })
    .catch(() => null);
}

export type Bucket = {
  key: string;
  label: string;
  views: number;
  visitors: number;
};

type RawBucket = { bucket: string; views: number | bigint; visitors: number | bigint };

/**
 * `COUNT(DISTINCT …)` has no Prisma Client equivalent (`groupBy` can only count rows),
 * so the two figures the panel shows — how many visits and how many people — are read
 * in one raw query per period.
 */
async function bucketStats(
  column: "day" | "month",
  keys: string[]
): Promise<Bucket[]> {
  if (keys.length === 0) return [];

  const oldest = keys[keys.length - 1];
  const rows =
    column === "day"
      ? await prisma.$queryRaw<RawBucket[]>`
          SELECT "day" AS bucket, COUNT(*) AS views,
                 COUNT(DISTINCT "visitorHash") AS visitors
          FROM "PageView" WHERE "day" >= ${oldest} GROUP BY "day"`
      : await prisma.$queryRaw<RawBucket[]>`
          SELECT "month" AS bucket, COUNT(*) AS views,
                 COUNT(DISTINCT "visitorHash") AS visitors
          FROM "PageView" WHERE "month" >= ${oldest} GROUP BY "month"`;

  const byKey = new Map(rows.map((row) => [row.bucket, row]));
  const label = column === "day" ? formatDayKey : formatMonthKey;

  // Built from `keys`, not from `rows`, so a period with no traffic shows as a zero
  // instead of vanishing and making the chart lie about the gap.
  return keys.map((key) => {
    const row = byKey.get(key);
    return {
      key,
      label: label(key),
      views: Number(row?.views ?? 0),
      visitors: Number(row?.visitors ?? 0),
    };
  });
}

export function getDailyStats(days: number): Promise<Bucket[]> {
  return bucketStats("day", recentDayKeys(days));
}

export function getMonthlyStats(months: number): Promise<Bucket[]> {
  return bucketStats("month", recentMonthKeys(months));
}

export type PathStat = { path: string; views: number; visitors: number };

/** Most-visited pages over the given Jalali days. */
export async function getTopPaths(
  days: number,
  limit = 8
): Promise<PathStat[]> {
  const oldest = recentDayKeys(days).at(-1) ?? jalaliKeys().day;

  const rows = await prisma.$queryRaw<
    { path: string; views: number | bigint; visitors: number | bigint }[]
  >`
    SELECT "path", COUNT(*) AS views, COUNT(DISTINCT "visitorHash") AS visitors
    FROM "PageView" WHERE "day" >= ${oldest}
    GROUP BY "path" ORDER BY views DESC LIMIT ${limit}`;

  return rows.map((row) => ({
    path: row.path,
    views: Number(row.views),
    visitors: Number(row.visitors),
  }));
}

/**
 * Totals for the summary cards.
 *
 * The all-time figure is deliberately views only. Because the salt is re-derived every
 * month, one person who visits in two different months has two different hashes — so a
 * distinct count over all time would be a count of person-months, not of people, and
 * showing it as "افراد" would be a lie. People are only ever counted within a period the
 * salt is constant for: a day, or a month.
 */
export async function getAnalyticsSummary() {
  const { day, month } = jalaliKeys();

  const [today, thisMonth, allTime] = await Promise.all([
    prisma.$queryRaw<RawBucket[]>`
      SELECT ${day} AS bucket, COUNT(*) AS views,
             COUNT(DISTINCT "visitorHash") AS visitors
      FROM "PageView" WHERE "day" = ${day}`,
    prisma.$queryRaw<RawBucket[]>`
      SELECT ${month} AS bucket, COUNT(*) AS views,
             COUNT(DISTINCT "visitorHash") AS visitors
      FROM "PageView" WHERE "month" = ${month}`,
    prisma.pageView.count(),
  ]);

  const read = (rows: RawBucket[]) => ({
    views: Number(rows[0]?.views ?? 0),
    visitors: Number(rows[0]?.visitors ?? 0),
  });

  return {
    today: read(today),
    month: read(thisMonth),
    allTimeViews: allTime,
    dayLabel: formatDayKey(day),
    monthLabel: formatMonthKey(month),
  };
}
