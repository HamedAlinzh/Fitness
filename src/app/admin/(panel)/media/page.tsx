import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { mediaNotice } from "@/lib/media";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import GalleryItemCard from "@/components/admin/GalleryItemCard";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; n?: string }>;
}) {
  await requireAdmin();

  const { ok, n } = await searchParams;
  // Every action redirects here on success, so the outcome message arrives in the URL
  // rather than in the form's own state. See `finish()` in src/lib/actions/media.ts.
  const notice = mediaNotice(ok);

  const items = await prisma.galleryItem.findMany({
    orderBy: { takenAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      {notice && (
        <p className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      {/* Keyed on the redirect's nonce so a finished upload remounts the form, clearing
          the picked file and the previous error instead of leaving it ready to re-send. */}
      <GalleryUploadForm key={n ?? "new"} />

      {items.length === 0 ? (
        <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز عکس یا ویدیویی در گالری نیست.
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
