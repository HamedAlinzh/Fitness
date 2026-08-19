/**
 * Plain (non-"use server") module: a `"use server"` file may only export async
 * functions, so these shared runtime values can't live alongside the lead actions.
 *
 * `status` and `mode` are plain String columns because SQLite has no enums; these are
 * the allowed values, and the labels are the Persian copy used in the admin panel.
 */
export const LEAD_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "جدید",
  CONTACTED: "تماس گرفته شد",
  CLOSED: "بسته شده",
};

export const LEAD_MODE_LABELS: Record<string, string> = {
  online: "آنلاین",
  "in-person": "حضوری در شیراز",
  "not-sure": "هنوز مطمئن نیست",
};
