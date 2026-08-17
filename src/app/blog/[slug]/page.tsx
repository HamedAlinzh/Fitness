import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { prisma } from "@/lib/prisma";
import { hashVariant } from "@/lib/placeholder-icon";

const icons = [BookOpen, Dumbbell, Salad, HeartPulse, Timer, Brain];

function readTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 120));
  return `${minutes} دقیقه مطالعه`;
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true } });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) return {};

  return {
    title: `${post.title} | کوچ فیت`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  const variant = hashVariant(post.id);
  const paragraphs = post.content.split("\n").filter(Boolean);

  return (
    <article className="py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-8">
        <PlaceholderMedia
          icon={icons[variant % icons.length]}
          variant={variant}
          src={post.coverImage}
          alt={post.title}
          className="aspect-[16/9] w-full rounded-3xl"
        />

        <div className="flex flex-col gap-4 text-right">
          <span className="flex items-center gap-1 text-xs text-ink-500">
            <Clock className="h-3.5 w-3.5" />
            {readTime(post.content)}
          </span>
          <h1 className="text-3xl font-extrabold text-ink-900">{post.title}</h1>
        </div>

        <div className="flex flex-col gap-5 text-right leading-8 text-ink-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button href="/blog" variant="secondary">
            بازگشت به بلاگ
          </Button>
        </div>
      </Container>
    </article>
  );
}
