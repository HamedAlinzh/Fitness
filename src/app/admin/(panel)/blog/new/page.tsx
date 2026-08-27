import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAdmin } from "@/lib/auth/dal";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function AdminNewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-500 transition-colors hover:text-red-600"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به فهرست مقاله‌ها
      </Link>

      <BlogPostForm />
    </div>
  );
}
