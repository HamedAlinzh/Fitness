import {
  Phone,
  Trash2,
  Calendar,
  MessageCircle,
  Send,
  MessageSquare,
  HeartPulse,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { setLeadStatus, deleteLead } from "@/lib/actions/leads";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/leads";
import {
  GOALS,
  LEVELS,
  MODES,
  DAYS_PER_WEEK,
  CHANNELS,
  labelOf,
} from "@/lib/consultation";
import {
  whatsappUrl,
  telegramUrl,
  telUrl,
  smsUrl,
  greetingFor,
} from "@/lib/contact-links";

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
      {leads.map((lead) => {
        const greeting = greetingFor(lead.name);
        const preferred = labelOf(CHANNELS, lead.preferredChannel);

        const replyLinks = [
          {
            key: "whatsapp",
            label: "واتساپ",
            icon: MessageCircle,
            href: whatsappUrl(lead.phone, greeting),
          },
          {
            key: "telegram",
            label: "تلگرام",
            icon: Send,
            href: telegramUrl(lead.phone, lead.telegramUsername, greeting),
          },
          { key: "call", label: "تماس", icon: Phone, href: telUrl(lead.phone) },
          {
            key: "sms",
            label: "پیامک",
            icon: MessageSquare,
            href: smsUrl(lead.phone, greeting),
          },
        ];

        const answers = [
          labelOf(GOALS, lead.goal),
          labelOf(LEVELS, lead.level),
          labelOf(MODES, lead.mode),
          `${labelOf(DAYS_PER_WEEK, String(lead.daysPerWeek))} در هفته`,
        ];

        return (
          <article
            key={lead.id}
            className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-ink-900">{lead.name}</span>
                <a
                  href={telUrl(lead.phone)}
                  dir="ltr"
                  className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {lead.phone}
                </a>
                {lead.telegramUsername && (
                  <span dir="ltr" className="text-xs text-ink-500">
                    @{lead.telegramUsername}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Calendar className="h-3.5 w-3.5" />
                {lead.createdAt.toLocaleDateString("fa-IR")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {answers.map((answer) => (
                <span
                  key={answer}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                >
                  {answer}
                </span>
              ))}
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700">
                ترجیح: {preferred}
              </span>
            </div>

            {lead.hasInjury && (
              <p className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                <HeartPulse className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  محدودیت پزشکی دارد
                  {lead.injuryNote ? `: ${lead.injuryNote}` : ""}
                </span>
              </p>
            )}

            {lead.message && (
              <p className="text-sm leading-7 text-ink-500">{lead.message}</p>
            )}

            <div className="flex flex-wrap gap-2 border-t border-red-100 pt-4">
              {replyLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    // Highlight the channel the person actually asked for.
                    link.key === lead.preferredChannel
                      ? "inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                      : "inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  }
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              ))}
            </div>

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
                        ? "rounded-full bg-ink-700 px-4 py-2 text-xs font-semibold text-white"
                        : "rounded-full border border-ink-100 px-4 py-2 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-50"
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
        );
      })}
    </div>
  );
}
