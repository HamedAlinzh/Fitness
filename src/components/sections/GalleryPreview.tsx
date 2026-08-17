import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/motion/FadeIn";
import GalleryTile from "@/components/sections/GalleryTile";
import { prisma } from "@/lib/prisma";

export default async function GalleryPreview() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { takenAt: "desc" },
    take: 6,
  });

  if (items.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="گالری روزانه"
          title="یه نگاه به تمرین‌های هر روز"
          description="عکس و ویدیوی تمرین‌ها و لحظات باشگاه، هر روز به‌روزرسانی می‌شه."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {items.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.06}>
              <GalleryTile item={item} />
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/gallery" variant="secondary">
            مشاهده گالری کامل ←
          </Button>
        </div>
      </Container>
    </section>
  );
}
