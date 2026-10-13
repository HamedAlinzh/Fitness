"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { normalizeContactPhone } from "@/lib/phone";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  GOALS,
  LEVELS,
  MODES,
  DAYS_PER_WEEK,
  CHANNELS,
  isValid,
} from "@/lib/consultation";

/**
 * DELIBERATELY UNAUTHENTICATED — the public consultation form posts here. Like
 * submit-testimonial.ts it lives apart from the admin actions so the "every action in
 * that file calls requireAdmin()" rule stays true. It can only create leads with
 * status NEW; it can never read or modify existing ones.
 */

const NOTE_MAX = 1000;
const INJURY_NOTE_MAX = 300;

export type SubmitLeadState = { error?: string; success?: string } | undefined;

export async function submitLead(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // Which page the form was on. It only chooses the language of the replies and of the
  // coach's follow-up; an unknown value just means Persian.
  const rawLocale = get("locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const t = getDictionary(locale).consultation;

  const name = get("name");
  const goal = get("goal");
  const level = get("level");
  const mode = get("mode");
  const days = get("daysPerWeek");
  const preferredChannel = get("preferredChannel");
  const hasInjury = get("hasInjury") === "yes";
  const injuryNote = get("injuryNote").slice(0, INJURY_NOTE_MAX);
  const message = get("message").slice(0, NOTE_MAX);

  // The browser can be bypassed, so every choice is re-checked against the allow-lists.
  if (
    !isValid(GOALS, goal) ||
    !isValid(LEVELS, level) ||
    !isValid(MODES, mode) ||
    !isValid(DAYS_PER_WEEK, days) ||
    !isValid(CHANNELS, preferredChannel)
  ) {
    return { error: t.errors.answerAll };
  }

  if (name.length < 2 || name.length > 50) {
    return { error: t.errors.name };
  }

  const phone = normalizeContactPhone(get("phone"));
  if (!phone) {
    return { error: t.errors.phone };
  }

  // Stored without the leading @ so link building stays predictable.
  const telegramUsername =
    get("telegramUsername").replace(/^@/, "").trim() || null;

  if (telegramUsername && !/^[A-Za-z0-9_]{5,32}$/.test(telegramUsername)) {
    return { error: t.errors.telegram };
  }

  // Cheap double-submit guard, matching the testimonial form's behaviour.
  const duplicate = await prisma.lead.findFirst({
    where: { phone, status: "NEW", goal, mode },
    select: { id: true },
  });

  if (duplicate) {
    return { success: t.duplicate };
  }

  await prisma.lead.create({
    data: {
      name,
      phone,
      telegramUsername,
      preferredChannel,
      goal,
      level,
      mode,
      daysPerWeek: Number(days),
      hasInjury,
      injuryNote: hasInjury && injuryNote ? injuryNote : null,
      message: message || null,
      locale,
      status: "NEW",
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  return { success: t.success };
}
