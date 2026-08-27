"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Save,
  Trash2,
} from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import {
  createBlogPost,
  updateBlogPost,
  removeBlogCover,
  deleteBlogPost,
  type BlogState,
} from "@/lib/actions/blog";
import { BLOG_LIMITS, slugify } from "@/lib/blog";
import { hashVariant } from "@/lib/placeholder-icon";

const fieldClass =
  "rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400";

export type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
};

/**
 * One editor for both "new post" and "edit post". The two differ only in which action
 * they submit to and whether the cover/delete controls have a row to act on, so keeping
 * them in one component is what stops the create and edit forms drifting apart.
 */
export default function BlogPostForm({ post }: { post?: EditablePost }) {
  const [state, action, pending] = useActionState<BlogState, FormData>(
    post ? updateBlogPost : createBlogPost,
    undefined
  );

  // Live preview of the URL the post will get. A pure enhancement: with no JavaScript
  // the slug field is simply an empty optional input, and the action derives the slug
  // from the title exactly the same way.
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const previewSlug = slugify(slug || title);

  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
      <aside className="flex w-full flex-col gap-3 rounded-3xl border border-red-100 bg-white p-6 lg:w-72 lg:shrink-0">
        <h2 className="text-base font-bold text-ink-900">عکس شاخص</h2>

        <PlaceholderMedia
          icon={BookOpen}
          variant={post ? hashVariant(post.id) : 0}
          src={post?.coverImage}
          alt={post?.title ?? ""}
          className="aspect-[16/10] w-full rounded-2xl"
        />

        {post?.coverImage ? (
          <form action={removeBlogCover}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف عکس
            </button>
          </form>
        ) : (
          <p className="text-xs leading-6 text-ink-500">
            بدون عکس، یک کادر رنگی با آیکون نمایش داده می‌شود.
          </p>
        )}

        {post && (
          <>
            <a
              href={`/blog/${encodeURIComponent(post.slug)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-t border-red-100 pt-3 text-xs font-semibold text-red-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              دیدن در سایت
            </a>

            <form action={deleteBlogPost}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
              >
                <Trash2 className="h-3.5 w-3.5" />
                حذف کامل مقاله
              </button>
            </form>
          </>
        )}
      </aside>

      <form
        action={action}
        className="flex flex-1 flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6 text-right"
      >
        {post && <input type="hidden" name="id" value={post.id} />}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blog-title" className="text-sm font-medium text-ink-700">
            عنوان مقاله
          </label>
          <input
            id="blog-title"
            name="title"
            type="text"
            required
            maxLength={BLOG_LIMITS.title}
            defaultValue={post?.title}
            onChange={(event) => setTitle(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blog-slug" className="text-sm font-medium text-ink-700">
            نشانی مقاله (اختیاری)
          </label>
          <input
            id="blog-slug"
            name="slug"
            type="text"
            dir="ltr"
            maxLength={BLOG_LIMITS.slug}
            defaultValue={post?.slug}
            onChange={(event) => setSlug(event.target.value)}
            className={`${fieldClass} text-left`}
          />
          <p className="text-xs leading-6 text-ink-500">
            خالی بگذاری، از روی عنوان ساخته می‌شود.{" "}
            {previewSlug && (
              <>
                نشانی:{" "}
                {/* <bdi> keeps the "/blog/" prefix on the left of a Persian slug — an
                    RTL run inside an LTR path is otherwise reordered around it. */}
                <span dir="ltr" className="font-semibold text-ink-700">
                  /blog/<bdi>{previewSlug}</bdi>
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blog-excerpt" className="text-sm font-medium text-ink-700">
            چکیده
          </label>
          <textarea
            id="blog-excerpt"
            name="excerpt"
            required
            rows={3}
            maxLength={BLOG_LIMITS.excerpt}
            defaultValue={post?.excerpt}
            className={`${fieldClass} resize-y leading-8`}
          />
          <p className="text-xs text-ink-500">
            همان چند خطی که روی کارت مقاله در فهرست بلاگ دیده می‌شود.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blog-content" className="text-sm font-medium text-ink-700">
            متن مقاله
          </label>
          <textarea
            id="blog-content"
            name="content"
            required
            rows={16}
            maxLength={BLOG_LIMITS.content}
            defaultValue={post?.content}
            className={`${fieldClass} resize-y leading-8`}
          />
          <p className="text-xs text-ink-500">
            هر خط یک پاراگراف جداگانه می‌شود.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="blog-cover" className="text-sm font-medium text-ink-700">
            عکس شاخص (JPG، PNG یا WebP — حداکثر ۵ مگابایت)
          </label>
          <input
            id="blog-cover"
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={`${fieldClass} file:ml-3 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-red-600`}
          />
          {post && (
            <p className="text-xs text-ink-500">
              اختیاری است؛ اگر فایلی انتخاب نکنی عکس فعلی دست‌نخورده می‌ماند.
            </p>
          )}
        </div>

        <label className="flex items-center gap-2.5 rounded-xl bg-red-50/60 px-4 py-3 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post ? post.published : true}
            className="h-4 w-4 accent-red-500"
          />
          منتشر شود (اگر تیک نزنی، پیش‌نویس می‌ماند و در سایت دیده نمی‌شود)
        </label>

        {state?.error && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {pending
            ? "در حال ذخیره…"
            : post
              ? "ذخیره تغییرات"
              : "ثبت مقاله"}
        </button>
      </form>
    </div>
  );
}
