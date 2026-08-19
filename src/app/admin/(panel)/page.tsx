import Link from "next/link";
import { MessageSquareQuote, Images, Inbox, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [pendingTestimonials, totalTestimonials, galleryCount, newLeads, totalLeads] =
    await Promise.all([
      prisma.testimonial.count({ where: { approved: false } }),
      prisma.testimonial.count(),
      prisma.galleryItem.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
    ]);

  const cards = [
    {
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      label: "نظرات در انتظار تایید",
      value: pendingTestimonials,
      hint: `از مجموع ${totalTestimonials} نظر`,
    },
    {
      href: "/admin/media",
      icon: Images,
      label: "تصاویر گالری",
      value: galleryCount,
      hint: "بارگذاری و جایگزینی تصاویر",
    },
    {
      href: "/admin/leads",
      icon: Inbox,
      label: "درخواست‌های جدید مشاوره",
      value: newLeads,
      hint: `از مجموع ${totalLeads} درخواست`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-3 rounded-3xl border border-red-100 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-red-200/50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <card.icon className="h-5 w-5" />
            </span>
            <span className="text-3xl font-extrabold text-ink-900">
              {card.value.toLocaleString("fa-IR")}
            </span>
            <span className="text-sm font-semibold text-ink-700">{card.label}</span>
            <span className="text-xs text-ink-500">{card.hint}</span>
          </Link>
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-2xl border border-red-100 bg-white p-4 text-sm leading-6 text-ink-500">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        فرم مشاوره‌ی سایت هنوز به این پنل وصل نشده و درخواست‌ها ذخیره نمی‌شوند؛ این اتصال
        در مرحله‌ی بعد انجام می‌شود.
      </p>
    </div>
  );
}
