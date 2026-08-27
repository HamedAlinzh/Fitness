import { ExternalLink, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { deleteInstagramPost } from "@/lib/actions/instagram";
import InstagramPostForm from "@/components/admin/InstagramPostForm";
import InstagramPostTile from "@/components/sections/InstagramPostTile";
import {
  INSTAGRAM_FEED_SIZE,
  INSTAGRAM_HANDLE,
  INSTAGRAM_TYPE_LABELS,
  instagramPostUrl,
  type InstagramPostType,
} from "@/lib/instagram";

export default async function AdminInstagramPage() {
  await requireAdmin();

  const posts = await prisma.instagramPost.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <InstagramPostForm />

      <section className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6">
        <div>
          <h2 className="text-base font-bold text-ink-900">
            پست‌های فعلی صفحه‌ی اصلی
          </h2>
          <p className="mt-1 text-sm leading-7 text-ink-500">
            به همین ترتیب، از راست به چپ، در بخش اینستاگرام نمایش داده می‌شوند. حساب:{" "}
            <span dir="ltr" className="font-semibold text-ink-700">
              {INSTAGRAM_HANDLE}
            </span>
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink-500">
            هنوز پستی اضافه نشده است. تا وقتی پستی نباشد، این بخش در صفحه‌ی اصلی اصلاً
            نمایش داده نمی‌شود.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {posts.map((post, index) => (
              <div key={post.id} className="flex flex-col gap-2">
                <div className="relative">
                  <InstagramPostTile post={post} />
                  <span className="absolute top-2 start-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-ink-900">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  {index >= INSTAGRAM_FEED_SIZE && (
                    <span className="absolute bottom-2 start-2 rounded-full bg-ink-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                      خارج از نمایش
                    </span>
                  )}
                </div>

                <span className="text-xs font-semibold text-ink-700">
                  {INSTAGRAM_TYPE_LABELS[post.type as InstagramPostType] ?? post.type}
                </span>

                <a
                  href={instagramPostUrl(post.shortcode, post.type)}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="inline-flex items-center gap-1 truncate text-xs text-red-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {post.shortcode}
                </a>

                <form action={deleteInstagramPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
