"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";

/**
 * DELIBERATELY UNAUTHENTICATED — this is the one Server Action in the project that the
 * public may call, so it lives in its own file rather than beside the admin-only actions
 * in testimonials.ts. It can only ever create rows with `approved: false`; nothing here
 * may set or change the approval flag, which is what keeps unreviewed text off the site.
 */

const NAME_MAX = 50;
const CONTENT_MIN = 10;
const CONTENT_MAX = 1000;

export type SubmitTestimonialState =
  | { error?: string; success?: string }
  | undefined;

export async function submitTestimonial(
  _prev: SubmitTestimonialState,
  formData: FormData
): Promise<SubmitTestimonialState> {
  const studentName = String(formData.get("studentName") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (studentName.length < 2 || studentName.length > NAME_MAX) {
    return { error: "نام را بین ۲ تا ۵۰ کاراکتر وارد کنید." };
  }

  const phone = normalizePhone(rawPhone);
  if (!phone) {
    return { error: "شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹" };
  }

  if (content.length < CONTENT_MIN || content.length > CONTENT_MAX) {
    return { error: "متن نظر را بین ۱۰ تا ۱۰۰۰ کاراکتر بنویسید." };
  }

  // Cheap double-submit guard: the same number sending the same text again is almost
  // always a duplicate post, not a second review.
  const duplicate = await prisma.testimonial.findFirst({
    where: { phone, content },
    select: { id: true },
  });

  if (duplicate) {
    return { success: "نظر شما قبلاً ثبت شده و در انتظار تایید است." };
  }

  await prisma.testimonial.create({
    data: { studentName, phone, content, approved: false },
  });

  // Surface it in the admin queue immediately.
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");

  return {
    success:
      "نظر شما ثبت شد. ممنون از وقتی که گذاشتید!",
  };
}
