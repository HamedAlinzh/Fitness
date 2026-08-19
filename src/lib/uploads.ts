import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_URL_PREFIX = "/uploads/";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

/** Extension is derived from the sniffed type, never from the user-supplied filename. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Checks the file's magic bytes rather than trusting the browser-supplied Content-Type,
 * which any client can forge.
 */
function sniffType(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  const ascii = (i: number, s: string) =>
    String.fromCharCode(...bytes.slice(i, i + s.length)) === s;
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) {
    return "image/webp";
  }
  return null;
}

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function saveUpload(file: File): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "فایلی انتخاب نشده است." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "حجم فایل باید کمتر از ۵ مگابایت باشد." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = sniffType(bytes);

  if (!detected || !ALLOWED_TYPES[detected]) {
    return { ok: false, error: "فقط فایل‌های JPG، PNG و WebP مجاز هستند." };
  }

  const filename = `${randomUUID()}.${ALLOWED_TYPES[detected]}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return { ok: true, url: `${UPLOAD_URL_PREFIX}${filename}` };
}

/**
 * Removes a previously uploaded file. Only paths under /uploads/ are touched, so a
 * tampered-with database value can't be used to delete arbitrary files, and images that
 * were shipped with the repo (e.g. /instagram/*) are left alone.
 */
export async function deleteUpload(url: string | null | undefined) {
  if (!url || !url.startsWith(UPLOAD_URL_PREFIX)) return;

  const filename = path.basename(url);
  const target = path.join(UPLOAD_DIR, filename);

  // Reject anything that escapes the upload directory after normalisation.
  if (path.dirname(target) !== UPLOAD_DIR) return;

  try {
    await unlink(target);
  } catch {
    // Already gone — deleting the database row is still the desired outcome.
  }
}
