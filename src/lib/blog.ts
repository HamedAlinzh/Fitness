/**
 * Shared constants and pure helpers for blog posts.
 *
 * No Prisma import: the admin editor is a Client Component and needs the limits and the
 * slug helper for its live URL preview. Same split as `src/lib/leads.ts` vs
 * `src/lib/actions/leads.ts`.
 */

export const BLOG_LIMITS = {
  title: 160,
  slug: 120,
  excerpt: 300,
  content: 20000,
} as const;

/**
 * Builds the URL segment for a post.
 *
 * Latin letters and digits are kept as-is; everything else that isn't a letter or digit
 * becomes a dash. Persian letters are *kept* rather than stripped, so a coach who writes
 * an all-Persian title and never touches the slug field still gets a working, readable
 * URL instead of an empty string. The route decodes the segment before looking it up
 * (see src/app/(site)/blog/[slug]/page.tsx), which is what makes that work — Next.js
 * hands a dynamic param to the page still percent-encoded.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // Arabic-Indic and Persian digits → ASCII, so "۵ اشتباه" and "5 اشتباه" agree.
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    // Zero-width non-joiner is a word separator in Persian, not part of a word.
    .replace(/‌/g, "-")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, BLOG_LIMITS.slug)
    .replace(/-+$/g, "");
}

/** Roughly how long the post takes to read; also used on the cards. */
export function readMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 120));
}

export function readTime(text: string): string {
  return `${readMinutes(text)} دقیقه مطالعه`;
}

/**
 * Splits stored prose into paragraphs. The public post page has always treated a single
 * newline as a paragraph break; blank lines collapse rather than producing empty
 * paragraphs.
 */
export function blogParagraphs(content: string): string[] {
  return content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
