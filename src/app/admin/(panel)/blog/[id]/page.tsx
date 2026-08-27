import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function AdminEditBlogPostPage({
  params,
}: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-500 transition-colors hover:text-red-600"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به فهرست مقاله‌ها
      </Link>

      <BlogPostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          published: post.published,
        }}
      />
    </div>
  );
}
