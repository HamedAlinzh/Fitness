import { headers } from "next/headers";
import { Trash2, Calendar, RefreshCw, Phone, StickyNote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import {
  setOrderStatus,
  deleteOrder,
  reissueOrderLink,
} from "@/lib/actions/orders";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_CLASSES,
  type OrderStatus,
  formatRialAsToman,
  isPayable,
  isExpired,
  paymentPath,
} from "@/lib/orders";
import { whatsappUrl, telUrl } from "@/lib/contact-links";
import CreateOrderForm from "@/components/admin/CreateOrderForm";
import PaymentLinkActions from "@/components/admin/PaymentLinkActions";
import { cn } from "@/lib/cn";

/**
 * Built from the request rather than an env var so the copied link is correct both on
 * localhost and on the VPS without extra configuration.
 */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const [packages, orders, origin] = await Promise.all([
    prisma.package.findMany({
      orderBy: [{ type: "asc" }, { priceToman: "asc" }],
      select: { id: true, title: true, priceToman: true, periodLabel: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { package: { select: { title: true, periodLabel: true } } },
    }),
    requestOrigin(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <CreateOrderForm packages={packages} />

      {orders.length === 0 ? (
        <p className="rounded-3xl border border-red-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز لینک پرداختی صادر نشده است.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = order.status as OrderStatus;
            const payable = isPayable(order);
            const url = `${origin}${paymentPath(order.token)}`;
            const expired = isExpired(order);

            const message = `سلام ${order.customerName} عزیز، لینک پرداخت پلن «${order.package.title}» به مبلغ ${formatRialAsToman(order.amountRial)}:\n${url}`;

            return (
              <article
                key={order.id}
                className="flex flex-col gap-4 rounded-3xl border border-red-100 bg-white p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-ink-900">
                      {order.customerName}
                    </span>
                    <a
                      href={telUrl(order.customerPhone)}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-red-600"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {order.customerPhone}
                    </a>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      ORDER_STATUS_CLASSES[status] ?? "bg-ink-100 text-ink-500"
                    )}
                  >
                    {ORDER_STATUS_LABELS[status] ?? order.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-ink-500">
                  <span className="font-semibold text-ink-700">
                    {order.package.title}
                  </span>
                  <span className="text-base font-extrabold text-red-600">
                    {formatRialAsToman(order.amountRial)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {order.createdAt.toLocaleDateString("fa-IR")}
                  </span>
                  {order.paidAt && (
                    <span className="text-green-700">
                      پرداخت: {order.paidAt.toLocaleDateString("fa-IR")}
                    </span>
                  )}
                  {expired && (
                    <span className="font-semibold text-red-600">
                      لینک منقضی شده
                    </span>
                  )}
                </div>

                {order.note && (
                  <p className="inline-flex items-start gap-2 rounded-xl bg-red-50/60 px-4 py-2.5 text-sm text-ink-700">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {order.note}
                  </p>
                )}

                {payable && (
                  <PaymentLinkActions
                    url={url}
                    whatsappHref={whatsappUrl(order.customerPhone, message)}
                  />
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-red-100 pt-4">
                  {ORDER_STATUSES.filter((s) => s !== status).map((s) => (
                    <form key={s} action={setOrderStatus}>
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        {s === "PAID"
                          ? "علامت‌گذاری پرداخت‌شده"
                          : ORDER_STATUS_LABELS[s]}
                      </button>
                    </form>
                  ))}

                  {(expired || status === "CANCELED") && (
                    <form action={reissueOrderLink}>
                      <input type="hidden" name="id" value={order.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        صدور لینک تازه
                      </button>
                    </form>
                  )}

                  <form action={deleteOrder} className="ms-auto">
                    <input type="hidden" name="id" value={order.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
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
      )}
    </div>
  );
}
