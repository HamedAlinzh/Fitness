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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-surface text-start transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40"
    >
      <PlaceholderMedia
        icon={icons[variant % icons.length]}
        variant={variant}
        src={post.coverImage}
        alt={post.title}
        className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="relative flex flex-1 flex-col gap-2 bg-surface p-6">
        <h3 className="text-lg font-bold leading-8 text-ink-900 transition-colors group-hover:text-red-300">{post.title}</h3>
        <p className="flex-1 text-sm leading-7 text-ink-500">{post.excerpt}</p>
        <span className="flex items-center gap-1 text-xs text-ink-500">
          <Clock className="h-3.5 w-3.5" />
          {blog.readTime(String(readMinutes(content ?? post.excerpt)))}
        </span>
      </div>
    </Link>
  );
}
