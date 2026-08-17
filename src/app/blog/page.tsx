import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/sections/BlogCard";
import FadeIn from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "بلاگ | کوچ فیت",
  description: "مقالات آموزشی درباره تمرین، تغذیه و سبک زندگی سالم.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="بلاگ"
        title="مقالات آموزشی تمرین و تغذیه"
        description="نکته‌های کاربردی برای تمرین بهتر، تغذیه درست و پیشگیری از آسیب."
      />

      <section className="py-16">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-sm text-ink-500">فعلاً مقاله‌ای منتشر نشده.</p>
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
