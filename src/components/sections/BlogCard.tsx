import Link from "next/link";
import { Clock, BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";
import { readMinutes } from "@/lib/blog";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

const icons = [BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain];

export type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
};

export default async function BlogCard({
  post,
  content,
}: {
  post: BlogPostData;
  content?: string;
}) {
  const lang = await getLocale();
  const { blog } = await getDict();
  const variant = hashVariant(post.id);

  return (
    <Link
      href={localePath(lang, `/blog/${post.slug}`)}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-red-100 bg-white text-start shadow-sm shadow-red-100/50 transition-shadow hover:shadow-lg hover:shadow-red-200/50"
    >
      <PlaceholderMedia
        icon={icons[variant % icons.length]}
        variant={variant}
        src={post.coverImage}
        alt={post.title}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="text-base font-bold text-ink-900">{post.title}</h3>
        <p className="flex-1 text-sm leading-7 text-ink-500">{post.excerpt}</p>
        <span className="flex items-center gap-1 text-xs text-ink-500">
          <Clock className="h-3.5 w-3.5" />
          {blog.readTime(String(readMinutes(content ?? post.excerpt)))}
        </span>
      </div>
    </Link>
  );
}
