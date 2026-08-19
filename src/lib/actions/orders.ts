"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { normalizePhone, toAsciiDigits } from "@/lib/phone";
import {
  ORDER_STATUSES,
  type OrderStatus,
  tomanToRial,
  paymentLinkExpiry,
} from "@/lib/orders";

/**
 * Admin-only actions. Server Actions are public HTTP endpoints, so every one of these
 * calls `requireAdmin()` itself — see the note in CLAUDE.md; the layout is not the
 * boundary. The public counterpart lives in `src/app/pay/[token]`, which reads an order
 * by its token and can't reach anything here.
 */

export type CreateOrderState = { error?: string; success?: string } | undefined;

/**
 * 128 bits of randomness. The token is the *only* thing authorising a checkout, so it
 * must not be guessable — which rules out the sequential-ish cuid used for ids.
 */
function newToken(): string {
  return randomBytes(16).toString("base64url");
}

export async function createOrder(
  _prev: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  await requireAdmin();

  const packageId = String(formData.get("packageId") ?? "");
  const customerName = String(formData.get("customerName") ?? "").trim();
  const note = String(formData.get("note") ?? "")
    .trim()
    .slice(0, 500);

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    select: { id: true, priceToman: true },
  });
  if (!pkg) {
    return { error: "پلن انتخاب‌شده پیدا نشد." };
  }

  if (customerName.length < 2 || customerName.length > 50) {
    return { error: "نام را بین ۲ تا ۵۰ کاراکتر وارد کنید." };
  }

  const customerPhone = normalizePhone(
    String(formData.get("customerPhone") ?? "")
  );
  if (!customerPhone) {
    return { error: "شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹" };
  }

  // Blank means "charge the plan's list price". A value overrides it — discounts and
  // instalments are normal here — and is typed in toman, the unit the coach thinks in.
  const amountRaw = toAsciiDigits(
    String(formData.get("amountToman") ?? "")
  ).replace(/[^\d]/g, "");

  let amountRial = tomanToRial(pkg.priceToman);
  if (amountRaw) {
    const toman = Number(amountRaw);
    if (!Number.isSafeInteger(toman) || toman <= 0) {
      return { error: "مبلغ معتبر نیست." };
    }
    amountRial = tomanToRial(toman);
  }

  await prisma.order.create({
    data: {
      token: newToken(),
      packageId: pkg.id,
      customerName,
      customerPhone,
      amountRial,
      note: note || null,
      expiresAt: paymentLinkExpiry(),
      status: "PENDING",
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: "لینک پرداخت ساخته شد." };
}

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  // `status` is a plain String column (SQLite has no enums), so the allowed values are
  // enforced here instead of by the schema.
  if (!id || !ORDER_STATUSES.includes(status as OrderStatus)) {
    return;
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    select: { paidAt: true },
  });
  if (!existing) return;

  await prisma.order.update({
    where: { id },
    data: {
      status,
      // Keep the original payment time if it's already marked paid, so re-clicking
      // "paid" doesn't rewrite history.
      paidAt: status === "PAID" ? (existing.paidAt ?? new Date()) : null,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/** Issues a fresh token and expiry for an order whose link expired or leaked. */
export async function reissueOrderLink(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.order.update({
    where: { id },
    data: { token: newToken(), expiresAt: paymentLinkExpiry(), status: "PENDING" },
  });

  revalidatePath("/admin/orders");
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
