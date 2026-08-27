import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_URL_PREFIX = "/uploads/";

/**
 * Files live under `public/uploads/`, but they are *served* by the route handler at
 * src/app/uploads/[file]/route.ts — Next.js only serves `public/` entries that existed
 * when the app was built, and these are written at runtime.
 */
export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB, images

/**
 * Videos get their own, much larger ceiling — a few seconds of phone video already
 * exceeds the image limit. It is still a ceiling rather than "whatever the phone shot":
 * the whole body is held in memory while the Server Action parses it, and this deploys
 * to a single small VPS. Roughly half a minute of 1080p phone footage fits.
 *
 * `serverActions.bodySizeLimit` in next.config.ts has to stay above this.
 */
export const MAX_VIDEO_BYTES = 45 * 1024 * 1024; // 45MB

/** What a stored file is, which is decided by sniffing the bytes — never by the form. */
export type UploadKind = "IMAGE" | "VIDEO";

/** Extension is derived from the sniffed type, never from the user-supplied filename. */
const ALLOWED_TYPES: Record<string, { ext: string; kind: UploadKind }> = {
  "image/jpeg": { ext: "jpg", kind: "IMAGE" },
  "image/png": { ext: "png", kind: "IMAGE" },
  "image/webp": { ext: "webp", kind: "IMAGE" },
  "video/mp4": { ext: "mp4", kind: "VIDEO" },
  // What an iPhone records. Safari plays it; other browsers depend on the codec inside,
  // which is why the admin copy suggests MP4 where there is a choice.
  "video/quicktime": { ext: "mov", kind: "VIDEO" },
  "video/webm": { ext: "webm", kind: "VIDEO" },
};

/** ISO base-media brands, read from bytes 8..12 of an `ftyp` box. */
const MP4_BRANDS = ["isom", "iso2", "iso4", "iso5", "iso6", "mp41", "mp42", "avc1", "mmp4", "M4V ", "dash"];
const HEIF_BRANDS = ["heic", "heix", "heim", "heis", "hevc", "hevx", "mif1", "msf1"];

/**
 * Checks the file's magic bytes rather than trusting the browser-supplied Content-Type,
 * which any client can forge.
 *
 * HEIF is recognised even though it is refused, so an iPhone photo that reached the
 * server untranscoded can be named in the error instead of being called "not an image".
 */
function sniffType(bytes: Uint8Array): string | null {
  if (bytes.length < 16) return null;

  const ascii = (i: number, length: number) =>
    String.fromCharCode(...bytes.slice(i, i + length));

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
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    return "image/webp";
  }
  // Matroska/WebM.
  if (
    bytes[0] === 0x1a &&
    bytes[1] === 0x45 &&
    bytes[2] === 0xdf &&
    bytes[3] === 0xa3
  ) {
    return "video/webm";
  }
  // MP4, MOV and HEIF all share the ISO base-media container; the brand tells them apart.
  if (ascii(4, 4) === "ftyp") {
    const brand = ascii(8, 4);
    if (brand === "qt  ") return "video/quicktime";
    if (MP4_BRANDS.includes(brand)) return "video/mp4";
    if (HEIF_BRANDS.includes(brand)) return "image/heif";
  }
  return null;
}

/** ALLOWED_TYPES read backwards, so the two directions can never disagree. */
const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(ALLOWED_TYPES).map(([type, { ext }]) => [ext, type])
);

/** The file extensions this app ever writes, for the route handler's name check. */
export const UPLOAD_EXTENSIONS = Object.keys(CONTENT_TYPES);

/**
 * The type to serve a stored file as. Derived from the extension *we* chose from the
 * sniffed bytes at save time, so it is never influenced by anything a client sent.
 */
export function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/** A validated, not-yet-written upload. `hash` identifies the bytes, for duplicate checks. */
export type PreparedUpload = {
  bytes: Uint8Array;
  ext: string;
  kind: UploadKind;
  hash: string;
};

export type PrepareResult =
  | ({ ok: true } & PreparedUpload)
  | { ok: false; error: string };

const IMAGE_FORMATS_ERROR = "فقط فایل‌های JPG، PNG و WebP مجاز هستند.";
const MEDIA_FORMATS_ERROR =
  "فقط عکس (JPG، PNG، WebP) و ویدیو (MP4، MOV، WebM) مجاز هستند.";
const HEIF_ERROR =
  "این عکس با فرمت HEIC آیفون است. آن را از خود اپ «عکس‌ها»ی آیفون انتخاب کنید تا به JPEG تبدیل شود، یا در تنظیمات دوربین گزینه «سازگارترین» را فعال کنید.";

/**
 * Validates a picked file and hashes it, without touching the filesystem.
 *
 * Splitting this out from the write is what lets a caller decide an upload is a duplicate
 * *before* a second copy of the same photo is written to disk — otherwise a rejected
 * duplicate would leave an orphaned file behind in `public/uploads/`.
 *
 * Video is opt-in: only the gallery accepts it. The blog cover, the about photo and the
 * Instagram screenshot are image slots, and their pages render them with `next/image`.
 */
export async function prepareUpload(
  file: File,
  options?: { allowVideo?: boolean }
): Promise<PrepareResult> {
  const allowVideo = options?.allowVideo ?? false;
  const formatsError = allowVideo ? MEDIA_FORMATS_ERROR : IMAGE_FORMATS_ERROR;

  if (!file || file.size === 0) {
    return { ok: false, error: "فایلی انتخاب نشده است." };
  }
  // Cheap pre-check against the largest thing this caller could accept, so an obviously
  // oversized file is refused before its bytes are pulled into memory.
  const ceiling = allowVideo ? MAX_VIDEO_BYTES : MAX_UPLOAD_BYTES;
  if (file.size > ceiling) {
    return { ok: false, error: sizeError(ceiling) };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = sniffType(bytes);

  if (detected === "image/heif") {
    return { ok: false, error: HEIF_ERROR };
  }

  const allowed = detected ? ALLOWED_TYPES[detected] : undefined;
  if (!allowed) return { ok: false, error: formatsError };
  if (allowed.kind === "VIDEO" && !allowVideo) {
    return { ok: false, error: formatsError };
  }

  // Now that the kind is known, apply its own limit — an image has no business being
  // measured against the video ceiling.
  const limit = allowed.kind === "VIDEO" ? MAX_VIDEO_BYTES : MAX_UPLOAD_BYTES;
  if (bytes.length > limit) {
    return { ok: false, error: sizeError(limit) };
  }

  return {
    ok: true,
    bytes,
    ext: allowed.ext,
    kind: allowed.kind,
    hash: createHash("sha256").update(bytes).digest("hex"),
  };
}

function sizeError(limit: number): string {
  const megabytes = Math.round(limit / (1024 * 1024));
  const persian = String(megabytes).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  return `حجم فایل باید کمتر از ${persian} مگابایت باشد.`;
}

/** Writes an already-validated upload under a fresh random name. */
export async function writeUpload(prepared: PreparedUpload): Promise<string> {
  const filename = `${randomUUID()}.${prepared.ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), prepared.bytes);

  return `${UPLOAD_URL_PREFIX}${filename}`;
}

export async function saveUpload(file: File): Promise<UploadResult> {
  const prepared = await prepareUpload(file);
  if (!prepared.ok) return { ok: false, error: prepared.error };

  return { ok: true, url: await writeUpload(prepared) };
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
