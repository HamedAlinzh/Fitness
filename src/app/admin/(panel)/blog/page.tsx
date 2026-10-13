import Link from "next/link";
import { BookOpen, Calendar, Eye, EyeOff, Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { setBlogPostPublished } from "@/lib/actions/blog";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";
import { cn } from "@/lib/cn";

export default async function AdminBlogPage() {
  await requireAdmin();

  // Drafts first: those are the ones still waiting on the coach.
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ published: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-100 bg-white p-6">
        <div>
          <h2 className="text-base font-bold text-ink-900">مقاله‌های بلاگ</h2>
          <p className="mt-1 text-sm leading-7 text-ink-500">
            مقاله‌ی تازه بنویس یا متن و عکس مقاله‌های موجود را عوض کن؛ بلافاصله روی سایت
            اعمال می‌شود.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          مقاله جدید
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز مقاله‌ای ثبت نشده است.
        </p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className={cn(
              "flex flex-col gap-4 rounded-3xl border bg-white p-4 sm:flex-row sm:items-center sm:p-6",
              post.published ? "border-red-100" : "border-ink-100"
            )}
          >
            <PlaceholderMedia
              icon={BookOpen}
              variant={hashVariant(post.id)}
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/10] w-full shrink-0 rounded-2xl sm:w-40"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-ink-900">{post.title}</h3>
                <span
                  className={
                    post.published
                      ? "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                      : "rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700"
                  }
                >
                  {post.published ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>

              <p className="line-clamp-2 text-sm leading-7 text-ink-500">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                {/* <bdi> isolates the slug: a Persian one is an RTL run inside an
                    LTR path, and without isolation the "/blog/" prefix is reordered to
                    the far end and the URL reads backwards. */}
                <span dir="ltr" className="truncate">
                  /blog/<bdi>{post.slug}</bdi>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {(post.publishedAt ?? post.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/admin/blog/${post.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Pencil className="h-4 w-4" />
                ویرایش
              </Link>

              <form action={setBlogPostPublished}>
                <input type="hidden" name="id" value={post.id} />
                <input
                  type="hidden"
                  name="published"
                  value={post.published ? "false" : "true"}
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
                >
                  {post.published ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      پیش‌نویس کن
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      منتشر کن
                    </>
                  )}
                </button>
              </form>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
