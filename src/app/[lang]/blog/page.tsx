import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import { getDict } from "@/i18n/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/sections/BlogCard";
import FadeIn from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).blog;
  return pageMetadata(lang, "/blog", {
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function BlogPage() {
  const { blog: t } = await getDict();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <section className="py-16">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-sm text-ink-500">{t.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <FadeIn key={post.slug} delay={(index % 6) * 0.08}>
                  <BlogCard post={post} content={post.content} />
                </FadeIn>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
