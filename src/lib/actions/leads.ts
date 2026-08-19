"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads";

export async function setLeadStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  // `status` is a plain String column (SQLite has no enums), so the allowed values are
  // enforced here instead of by the schema.
  if (!id || !LEAD_STATUSES.includes(status as LeadStatus)) {
    return;
  }

  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}
