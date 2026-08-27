/**
 * Constants and copy shared by the gallery admin screens.
 *
 * No Prisma import here on purpose: the upload forms are Client Components, so anything
 * they need has to live apart from the Server Actions in `src/lib/actions/media.ts`
 * (same split as `src/lib/leads.ts` vs `src/lib/actions/leads.ts`).
 */

/**
 * How long the same photo, under the same caption, is treated as an accidental repeat
 * rather than a deliberate second copy.
 *
 * The repeats this catches are a refresh that re-sends the POST, a second tap on a slow
 * phone connection, or the coach retrying because nothing appeared to happen — all of
 * which land within a minute or two. Uploading the identical file under the identical
 * caption on purpose, more than this long later, still works.
 */
export const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;

/**
 * What the gallery's file pickers offer. Kept in step with `ALLOWED_TYPES` in
 * `src/lib/uploads.ts`, which is the check that actually decides — this attribute is only
 * a filter in the picker and any client can ignore it.
 */
export const MEDIA_ACCEPT =
  "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm";

/**
 * Outcome codes carried in `?ok=` after a successful action.
 *
 * The gallery actions finish with a redirect (Post/Redirect/Get) rather than by returning
 * a success state, so the browser is left on a GET. That is what stops a refresh — a
 * pull-to-refresh on iOS especially — from re-sending the upload and creating another row.
 * The message therefore has to survive in the URL rather than in React state.
 */
export const MEDIA_NOTICES = {
  uploaded: "فایل با موفقیت اضافه شد.",
  duplicate:
    "همین فایل با همین عنوان چند لحظه پیش اضافه شده بود؛ نسخه تکراری ساخته نشد.",
  replaced: "فایل جایگزین شد.",
  unchanged: "همین فایل از قبل ثبت شده بود؛ چیزی تغییر نکرد.",
  deleted: "مورد حذف شد.",
  caption: "عنوان ذخیره شد.",
} as const;

export type MediaNoticeCode = keyof typeof MEDIA_NOTICES;

export function mediaNotice(code: string | undefined): string | null {
  if (!code) return null;
  return MEDIA_NOTICES[code as MediaNoticeCode] ?? null;
}
