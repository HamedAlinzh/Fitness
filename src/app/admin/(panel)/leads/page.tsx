import { Phone, Trash2, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { setLeadStatus, deleteLead } from "@/lib/actions/leads";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_MODE_LABELS,
} from "@/lib/leads";

export default async function AdminLeadsPage() {
  await requireAdmin();

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  if (leads.length === 0) {
    return (
      <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
        هنوز درخواست مشاوره‌ای ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {leads.map((lead) => (
        <article
          key={lead.id}
          className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-ink-900">{lead.name}</span>
              <a
                href={`tel:${lead.phone}`}
                dir="ltr"
                className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                {lead.phone}
              </a>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                {LEAD_MODE_LABELS[lead.mode] ?? lead.mode}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
              <Calendar className="h-3.5 w-3.5" />
              {lead.createdAt.toLocaleDateString("fa-IR")}
            </span>
          </div>

          <p className="text-sm leading-7 text-ink-500">{lead.message}</p>

          <div className="flex flex-wrap items-center gap-2">
            {LEAD_STATUSES.map((status) => (
              <form key={status} action={setLeadStatus}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="status" value={status} />
                <button
                  type="submit"
                  disabled={lead.status === status}
                  className={
                    lead.status === status
                      ? "rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white"
                      : "rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  }
                >
                  {LEAD_STATUS_LABELS[status]}
                </button>
              </form>
            ))}

            <form action={deleteLead} className="ms-auto">
              <input type="hidden" name="id" value={lead.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-ink-900"
              >
                <Trash2 className="h-3.5 w-3.5" />
                حذف
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
