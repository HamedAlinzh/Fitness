/**
 * Downscales a picked photo in the browser before it is uploaded.
 *
 * This exists because of the phone-camera cases the admin panel actually gets fed. An
 * iPhone shoots HEIC and Safari re-encodes the picked photo to a full-resolution JPEG,
 * which is routinely several megabytes — far larger than anything the gallery displays,
 * and large enough to run into upload limits. Re-drawing it at a sane size turns those
 * files into a few hundred kilobytes.
 *
 * It is a **pure enhancement**: it runs on `change`, replaces the input's file, and does
 * nothing at all if it fails or if JS never runs — in which case the original file is
 * submitted exactly as before and the server's own validation still applies. Nothing here
 * may become a precondition for uploading.
 */

/** Longest edge kept, in pixels. Gallery tiles are square thumbnails; this is generous. */
export const MAX_IMAGE_DIMENSION = 2000;

export const JPEG_QUALITY = 0.82;

/** Below this, a JPEG that is already small enough in both dimensions is left alone. */
export const COMPRESS_THRESHOLD_BYTES = 900 * 1024;

/** The formats the server accepts; anything else has to be converted, whatever its size. */
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function toJpegName(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "") || "photo";
  return `${base}.jpg`;
}

/**
 * Returns a smaller JPEG version of `file`, or `null` when the original should be sent
 * as-is (already small, conversion made it bigger, or the browser could not decode it —
 * a HEIC file outside Safari, for instance, which the server then rejects with a readable
 * message rather than silently mangling).
 */
export async function compressImageFile(file: File): Promise<File | null> {
  if (typeof document === "undefined") return null;
  if (!file.type.startsWith("image/")) return null;

  // A HEIC (or anything else the server won't take) must be re-encoded no matter how
  // small it is, so the size shortcuts below don't apply to it.
  const needsConversion = !ACCEPTED_TYPES.includes(file.type);

  if (!needsConversion && file.size <= COMPRESS_THRESHOLD_BYTES) {
    // Still worth checking the dimensions, but not worth decoding for a tiny file.
    if (file.size <= COMPRESS_THRESHOLD_BYTES / 3) return null;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = objectUrl;
    // `decode()` rejects on a format this browser cannot read, which is the HEIC case.
    await image.decode();

    const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
    if (!longestEdge) return null;

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / longestEdge);
    if (scale === 1 && !needsConversion && file.size <= COMPRESS_THRESHOLD_BYTES) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext("2d");
    if (!context) return null;

    // Browsers apply the EXIF orientation when they decode an <img>, so drawing the
    // element (rather than the raw bytes) keeps a portrait phone photo upright.
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) return null;

    // Re-encoding can enlarge an already well-compressed file; only keep a real win —
    // unless the original was a format the server refuses anyway.
    if (!needsConversion && blob.size >= file.size) return null;

    return new File([blob], toJpegName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
