import Link from "next/link";
import { Clock, BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";

const icons = [BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain];

export type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
};

function readTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 120));
  return `${minutes} دقیقه مطالعه`;
}

export default function BlogCard({
  post,
  content,
}: {
  post: BlogPostData;
  content?: string;
}) {
  const variant = hashVariant(post.id);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white text-right shadow-sm shadow-pink-100/50 transition-shadow hover:shadow-lg hover:shadow-pink-200/50"
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
          {readTime(content ?? post.excerpt)}
        </span>
      </div>
    </Link>
  );
}
