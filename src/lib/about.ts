/**
 * The "درباره من" copy and photo, editable from /admin/about.
 *
 * Shared constants and pure helpers only — no Prisma import — because the admin form is
 * a Client Component and needs the limits and the type. The database read lives in
 * `src/lib/about-content.ts`, the same split as `src/lib/leads.ts` vs
 * `src/lib/actions/leads.ts`.
 *
 * There is exactly one row, under a fixed id, rather than a row per language or per
 * page: the homepage preview and the /about page are two views of the same text, and
 * keeping them in one record is what stops them drifting apart.
 *
 * `DEFAULTS` is what the site showed before the section became editable. It is the
 * fallback whenever the row is missing, so a freshly migrated (or freshly reset)
 * database still renders a complete page instead of empty headings.
 */

export const ABOUT_CONTENT_ID = "about";

/** The text the public site shows — already resolved for one language. */
export type AboutContent = {
  eyebrow: string;
  heading: string;
  previewText: string;
  bodyText: string;
  image: string | null;
};

/** What the admin form edits: the Persian text plus its optional English counterpart. */
export type AboutEditable = AboutContent & {
  eyebrowEn: string;
  headingEn: string;
  previewTextEn: string;
  bodyTextEn: string;
};

export type AboutTextKey = "eyebrow" | "heading" | "previewText" | "bodyText";

export const ABOUT_DEFAULTS: AboutContent = {
  eyebrow: "درباره من",
  heading: "مربی‌ای که کنارت می‌مونه، نه فقط یک برنامه تمرینی می‌ده",
  previewText:
    "چند سالیه که در باشگاه‌های شیراز مربیگری می‌کنم و برای شاگردهام برنامه‌ی تمرینی و تغذیه‌ی کاملاً اختصاصی می‌نویسم. چه بخوای حضوری تمرین کنی چه آنلاین از هر جای ایران همراهت باشم، مسیر رو قدم‌به‌قدم با هم می‌ریم جلو.",
  bodyText: [
    "چند سالیه که در باشگاه‌های شیراز مربیگری می‌کنم و کنار شاگردهام هستم تا به هدفشون برسن؛ چه چربی‌سوزی، چه عضله‌سازی، چه فقط یک سبک زندگی سالم‌تر.",
    "باور دارم بهترین برنامه، برنامه‌ایه که با زندگی واقعی هرکس هماهنگ باشه؛ برای همین قبل از نوشتن هر برنامه، اول واقعاً گوش می‌دم به هدف، محدودیت‌ها و شرایط شاگردم.",
    "برای شاگردهای شیرازی حضوری تمرین می‌دم و برای بقیه‌ی ایران، مربیگری آنلاین با پیگیری روزانه و ارتباط مستقیم رو ارائه می‌دم.",
  ].join("\n\n"),
  image: null,
};

/**
 * What /en shows until the coach writes an English version. Same content as
 * `ABOUT_DEFAULTS`, so an untouched site reads the same in both languages.
 */
export const ABOUT_DEFAULTS_EN: AboutContent = {
  eyebrow: "About me",
  heading: "A coach who stays by your side — not just someone who hands you a plan",
  previewText:
    "I've been coaching in Shiraz's gyms for several years, writing fully personal training and nutrition plans for my students. Whether you want to train in person or online from anywhere, we'll take the road step by step together.",
  bodyText: [
    "I've been coaching in Shiraz's gyms for several years and I'm there for my students on the way to their goals — whether that's fat loss, building muscle, or simply a healthier lifestyle.",
    "I believe the best plan is the one that fits a person's real life. That's why, before writing any plan, I first listen carefully to my student's goal, limits and circumstances.",
    "I train Shiraz-based students in person, and offer online coaching with daily follow-up and direct contact to everyone else.",
  ].join("\n\n"),
  image: null,
};

/** Length caps, shared by the admin form's `maxLength` and the action's re-validation. */
export const ABOUT_LIMITS = {
  eyebrow: 40,
  heading: 160,
  previewText: 600,
  bodyText: 4000,
} as const;

export const ABOUT_TEXT_KEYS: readonly AboutTextKey[] = [
  "eyebrow",
  "heading",
  "previewText",
  "bodyText",
];

/**
 * Splits the stored prose into paragraphs on blank lines. A single newline is treated
 * as a paragraph break too, because that is what people actually type in a textarea.
 */
export function aboutParagraphs(bodyText: string): string[] {
  return bodyText
    .split(/\n\s*\n|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
