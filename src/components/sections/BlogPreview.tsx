import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import BlogCard from "@/components/sections/BlogCard";
import { prisma } from "@/lib/prisma";
import { getDict, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

export default async function BlogPreview() {
  const lang = await getLocale();
  const { blogPreview: t } = await getDict();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (posts.length === 0) return null;

  return (
    <section className="bg-red-50/60 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.1}>
              <BlogCard post={post} content={post.content} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href={localePath(lang, "/blog")} variant="ghost">
            {t.all}
          </Button>
        </div>
      </Container>
    </section>
  );
}
