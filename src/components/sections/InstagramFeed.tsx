import { AtSign } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import InstagramPostTile from "@/components/sections/InstagramPostTile";
import { INSTAGRAM_PROFILE_URL } from "@/lib/instagram";
import { prisma } from "@/lib/prisma";

export default async function InstagramFeed() {
  const posts = await prisma.instagramPost.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="اینستاگرام"
          title="آخرین پست‌ها رو دنبال کن!"
        />

        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {posts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 0.05}>
              <InstagramPostTile post={post} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href={INSTAGRAM_PROFILE_URL} external variant="secondary">
            <AtSign className="h-4 w-4" />
            دنبال کردن در اینستاگرام
          </Button>
        </div>
      </Container>
    </section>
  );
}
