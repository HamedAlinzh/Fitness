import { Check, X, Trash2, Star, Phone, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import {
  setTestimonialApproval,
  deleteTestimonial,
} from "@/lib/actions/testimonials";

export default async function AdminTestimonialsPage() {
  await requireAdmin();

  // Unapproved first — those are the ones needing a decision.
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
  });

  if (testimonials.length === 0) {
    return (
      <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
        هنوز نظری ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {testimonials.map((item) => (
        <article
          key={item.id}
          className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-ink-900">{item.studentName}</span>
              <span className="flex items-center gap-0.5 text-red-500">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              {item.phone && (
                <a
                  href={`tel:${item.phone}`}
                  dir="ltr"
                  className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {item.phone}
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Calendar className="h-3.5 w-3.5" />
                {item.createdAt.toLocaleDateString("fa-IR")}
              </span>
            </div>

            <span
              className={
                item.approved
                  ? "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  : "rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700"
              }
            >
              {item.approved ? "تایید شده" : "در انتظار تایید"}
            </span>
          </div>

          <p className="text-sm leading-7 text-ink-500">{item.content}</p>

          <div className="flex flex-wrap gap-2">
            <form action={setTestimonialApproval}>
              <input type="hidden" name="id" value={item.id} />
              <input
                type="hidden"
                name="approved"
                value={item.approved ? "false" : "true"}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                {item.approved ? (
                  <>
                    <X className="h-4 w-4" />
                    لغو تایید
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    تایید نظر
                  </>
                )}
              </button>
            </form>

            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                <Trash2 className="h-4 w-4" />
                حذف
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
