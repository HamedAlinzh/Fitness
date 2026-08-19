"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { parsePriceToman } from "@/lib/orders";

/**
 * Admin-only. Like every other action under the admin panel, each one calls
 * `requireAdmin()` itself — Server Actions are public HTTP endpoints and the layout is
 * not the security boundary (see CLAUDE.md).
 */

export type UpdatePriceState = { error?: string; success?: string } | undefined;

/**
 * Prices move often, so this is the one thing the coach can edit without a deploy.
 * The value is entered in whole toman — the same unit `Package.priceToman` stores, so
 * nothing is scaled behind the coach's back.
 */
export async function updatePackagePrice(
  _prev: UpdatePriceState,
  formData: FormData
): Promise<UpdatePriceState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "پلن مشخص نیست." };

  const parsed = parsePriceToman(String(formData.get("priceToman") ?? ""));
  if (!parsed.ok) {
    return {
      error:
        parsed.reason === "empty"
          ? "مبلغ را وارد کن."
          : parsed.reason === "too-large"
            ? "مبلغ غیرعادی بزرگ است — احتمالاً یک صفر اضافه خورده."
            : "مبلغ معتبر نیست.",
    };
  }

  const updated = await prisma.package
    .update({ where: { id }, data: { priceToman: parsed.value } })
    .catch(() => null);

  if (!updated) return { error: "پلن پیدا نشد." };

  // The public pages read prices directly, so they have to pick this up immediately.
  revalidatePath("/pricing");
  revalidatePath("/");
  revalidatePath("/admin/packages");
  revalidatePath("/admin/orders");

  return { success: `قیمت «${updated.title}» به‌روزرسانی شد.` };
}

/**
 * Moves the "پیشنهادی" badge. Exactly one plan can carry it, so setting it on one plan
 * clears it everywhere else in the same transaction — two highlighted cards next to each
 * other reads as a bug.
 */
export async function setHighlightedPackage(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const target = await prisma.package.findUnique({
    where: { id },
    select: { highlighted: true },
  });
  if (!target) return;

  await prisma.$transaction([
    prisma.package.updateMany({ data: { highlighted: false } }),
    // Clicking the badge on the plan that already has it turns it off entirely.
    ...(target.highlighted
      ? []
      : [prisma.package.update({ where: { id }, data: { highlighted: true } })]),
  ]);

  revalidatePath("/pricing");
  revalidatePath("/");
  revalidatePath("/admin/packages");
}
