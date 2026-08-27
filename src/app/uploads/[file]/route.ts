import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, contentTypeFor } from "@/lib/uploads";

/**
 * Serves the files written by `saveUpload` into `public/uploads/`.
 *
 * `public/` cannot do this job on its own: Next.js snapshots that directory's file list
 * at **build** time, so anything the coach uploads afterwards is a 404 for the running
 * server — and stays a 404 after a restart, until the next `next build`. The symptom is
 * an admin panel that accepts a photo, stores the row, and then shows a broken image
 * everywhere (including through `next/image`, which fetches the URL over HTTP and
 * reports "The requested resource isn't a valid image … received null").
 *
 * The stored URLs (`/uploads/<uuid>.<ext>`) are unchanged: build-time public files win
 * over app routes, so the only requests that reach here are exactly the runtime uploads
 * that `public/` cannot serve.
 */

// Uploaded filenames are a UUID plus one of three known extensions. Anything else is not
// something this app ever wrote, so it is refused before it can reach the filesystem.
const FILENAME_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  if (!FILENAME_PATTERN.test(file)) {
    return new Response("Not found", { status: 404 });
  }

  const target = path.join(UPLOAD_DIR, file);
  // Belt and braces: the pattern already forbids separators, but a path that escaped the
  // upload directory must never be read.
  if (path.dirname(target) !== UPLOAD_DIR) {
    return new Response("Not found", { status: 404 });
  }

  let size: number;
  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const body = await readFile(target);

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentTypeFor(file),
      "Content-Length": String(size),
      // Filenames are random UUIDs and a replacement always gets a new one, so a stored
      // copy can never be stale.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
