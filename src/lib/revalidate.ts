import { revalidatePath } from "next/cache";

/**
 * Refreshes every prerendered public page, in both languages.
 *
 * The public site is `app/[lang]/...` (Persian is served unprefixed through a rewrite in
 * `src/proxy.ts`), so there is no single URL to name per page any more — `/about` and
 * `/en/about` are both the one route `/[lang]/about`. Revalidating the `[lang]` layout
 * covers every page below it. The site is small enough that refreshing all of it on a
 * content edit costs nothing worth saving.
 */
export function revalidatePublicSite() {
  revalidatePath("/[lang]", "layout");
}
