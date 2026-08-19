"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/dal";

/**
 * Server Actions are public HTTP endpoints, so each one re-checks authorization itself
 * rather than trusting that the caller reached it through an admin page.
 */
export async function setTestimonialApproval(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const approved = String(formData.get("approved") ?? "") === "true";
  if (!id) return;

  await prisma.testimonial.update({ where: { id }, data: { approved } });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}
