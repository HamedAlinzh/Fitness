/**
 * Single source of truth for the consultation quiz. The public form renders these, the
 * Server Action validates against them, and the admin panel labels leads with them — so
 * a new option only has to be added here.
 *
 * Plain module (not "use server"): a "use server" file may only export async functions.
 */

export type Choice = { value: string; label: string };

export const GOALS: Choice[] = [
  { value: "FAT_LOSS", label: "چربی‌سوزی و کاهش وزن" },
  { value: "MUSCLE_GAIN", label: "عضله‌سازی" },
  { value: "GENERAL_FITNESS", label: "تناسب و سلامت عمومی" },
  { value: "COMPETITION", label: "آمادگی مسابقه" },
];

export const LEVELS: Choice[] = [
  { value: "BEGINNER", label: "تازه‌کار" },
  { value: "INTERMEDIATE", label: "نیمه‌حرفه‌ای" },
  { value: "ADVANCED", label: "حرفه‌ای" },
];

export const MODES: Choice[] = [
  { value: "online", label: "آنلاین" },
  { value: "in-person", label: "حضوری در شیراز" },
  { value: "not-sure", label: "هنوز مطمئن نیستم" },
];

export const DAYS_PER_WEEK: Choice[] = [
  { value: "2", label: "۲ روز" },
  { value: "3", label: "۳ روز" },
  { value: "4", label: "۴ روز" },
  { value: "5", label: "۵ روز یا بیشتر" },
];

export const CHANNELS: Choice[] = [
  { value: "whatsapp", label: "واتساپ" },
  { value: "telegram", label: "تلگرام" },
  { value: "call", label: "تماس تلفنی" },
];

export function labelOf(choices: Choice[], value: string): string {
  return choices.find((c) => c.value === value)?.label ?? value;
}

export const isValid = (choices: Choice[], value: string) =>
  choices.some((c) => c.value === value);
