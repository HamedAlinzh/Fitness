import { requireAdmin } from "@/lib/auth/dal";
import { getAboutContent } from "@/lib/about-content";
import AboutContentForm from "@/components/admin/AboutContentForm";

export default async function AdminAboutPage() {
  await requireAdmin();

  const about = await getAboutContent();

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-2xl border border-red-100 bg-white p-4 text-sm leading-7 text-ink-500">
        این متن و عکس هم در بخش «درباره من» صفحه‌ی اصلی و هم در صفحه‌ی{" "}
        <span className="font-semibold text-ink-700">/about</span> نمایش داده می‌شود.
      </p>

      <AboutContentForm about={about} />
    </div>
  );
}
