import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import GalleryGrid from "@/components/sections/GalleryGrid";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "گالری | کوچ فیت",
  description: "عکس و ویدیوی روزانه‌ی تمرین‌ها و لحظات باشگاه.",
};

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { takenAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="گالری"
        title="لحظات تمرین، روز به روز"
        description="عکس و ویدیوهایی از تمرین شاگردها و فضای باشگاه که هر روز به‌روزرسانی می‌شه."
      />
      <GalleryGrid items={items} />
    </>
  );
}
