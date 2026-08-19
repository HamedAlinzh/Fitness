import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import GalleryItemCard from "@/components/admin/GalleryItemCard";

export default async function AdminMediaPage() {
  await requireAdmin();

  const items = await prisma.galleryItem.findMany({
    orderBy: { takenAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <GalleryUploadForm />

      {items.length === 0 ? (
        <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز تصویری در گالری نیست.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
