import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Ban,
  Phone,
  MessageCircle,
  Receipt,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";
import { formatRialAsToman, isPayable, isExpired } from "@/lib/orders";
import { PAYMENT_GATEWAY_CONNECTED } from "@/lib/payments";
import { COACH_PHONE, COACH_PHONE_DISPLAY } from "@/lib/site-contact";
import { telUrl, whatsappUrl } from "@/lib/contact-links";

export const metadata: Metadata = {
  title: "پرداخت پلن | کوچ فیت",
  // A payment link is addressed by an unguessable token; it must never be indexed.
  robots: { index: false, follow: false },
};

// Status changes the moment the coach marks the order paid, so this must never be
// served from a cache.
export const dynamic = "force-dynamic";

export default async function PayPage({ params }: PageProps<"/pay/[token]">) {
  const { token } = await params;

  // `customerPhone` is deliberately not selected: this page is public to anyone holding
  // the link, and the payer's own number adds nothing to it.
  const order = await prisma.order.findUnique({
    where: { token },
    select: {
      customerName: true,
      amountRial: true,
      status: true,
      expiresAt: true,
      paidAt: true,
      package: { select: { title: true, periodLabel: true, description: true } },
    },
  });

  if (!order) notFound();

  const payable = isPayable(order);
  const expired = isExpired(order);

  const helpMessage = `سلام، درباره پرداخت پلن «${order.package.title}» به مبلغ ${formatRialAsToman(order.amountRial)} سؤال داشتم.`;

  return (
    <section className="py-16">
      <Container className="max-w-xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-red-100 bg-white p-6 text-right sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Receipt className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h1 className="text-lg font-extrabold text-ink-900">
                صورت‌حساب پرداخت
              </h1>
              <p className="text-sm text-ink-500">
                {order.customerName} عزیز، این صورت‌حساب برای توست.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-red-50/60 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-ink-500">پلن</span>
              <span className="font-bold text-ink-900">
                {order.package.title}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-ink-500">مدت</span>
              <span className="text-sm font-semibold text-ink-700">
                {order.package.periodLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-red-100 pt-3">
              <span className="text-sm text-ink-500">مبلغ قابل پرداخت</span>
              <span className="text-2xl font-extrabold text-red-600">
                {formatRialAsToman(order.amountRial)}
              </span>
            </div>
          </div>

          {order.status === "PAID" && (
            <div className="flex items-start gap-3 rounded-2xl bg-green-100 px-5 py-4 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">این صورت‌حساب پرداخت شده است.</p>
                {order.paidAt && (
                  <p className="mt-1">
                    تاریخ پرداخت: {order.paidAt.toLocaleDateString("fa-IR")}
                  </p>
                )}
              </div>
            </div>
          )}

          {order.status === "CANCELED" && (
            <div className="flex items-start gap-3 rounded-2xl bg-ink-100 px-5 py-4 text-sm text-ink-700">
              <Ban className="mt-0.5 h-5 w-5 shrink-0" />
              <p>این صورت‌حساب لغو شده است. برای صدور صورت‌حساب تازه تماس بگیر.</p>
            </div>
          )}

          {expired && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
              <Clock className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                مهلت این لینک تمام شده است. یک پیام بده تا لینک تازه برایت بفرستم.
              </p>
            </div>
          )}

          {payable && !PAYMENT_GATEWAY_CONNECTED && (
            <p className="rounded-2xl bg-red-50/60 px-5 py-4 text-sm leading-7 text-ink-700">
              پرداخت آنلاین به‌زودی روی سایت فعال می‌شود. فعلاً برای نهایی کردن
              پرداخت کافیست تماس بگیری یا پیام بدهی — همین صفحه را برایم بفرست تا
              بدانم کدام صورت‌حساب است.
            </p>
          )}

          {/* Always shown: whatever the state, the next step is talking to the coach. */}
          <div className="flex flex-col gap-3 border-t border-red-100 pt-6">
            <span className="text-sm text-ink-500">شماره تماس مربی</span>
            <a
              href={telUrl(COACH_PHONE)}
              dir="ltr"
              className="text-2xl font-extrabold tracking-wide text-red-600 transition-colors hover:text-red-700"
            >
              {COACH_PHONE_DISPLAY}
            </a>

            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href={telUrl(COACH_PHONE)}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600"
              >
                <Phone className="h-4 w-4" />
                تماس
              </a>
              <a
                href={whatsappUrl(COACH_PHONE, helpMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <MessageCircle className="h-4 w-4" />
                واتساپ
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
