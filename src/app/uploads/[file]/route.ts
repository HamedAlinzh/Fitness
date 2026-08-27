import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { UPLOAD_DIR, UPLOAD_EXTENSIONS, contentTypeFor } from "@/lib/uploads";

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

// Uploaded filenames are a UUID plus one of the extensions this app writes. Anything else
// is not something it ever produced, so it is refused before it can reach the filesystem.
const FILENAME_PATTERN = new RegExp(
  `^[0-9a-f-]{36}\\.(${UPLOAD_EXTENSIONS.join("|")})$`
);

const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Parses a single-range `Range: bytes=…` header. Multi-range requests are ignored (the
 * caller then gets the whole file, which is a legal response to any range request).
 */
function parseRange(header: string | null, size: number) {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === "" && rawEnd === "") return null;

  // "bytes=-500" means the last 500 bytes.
  const start = rawStart === "" ? Math.max(0, size - Number(rawEnd)) : Number(rawStart);
  const end = rawStart === "" || rawEnd === "" ? size - 1 : Number(rawEnd);

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start > end || start >= size) return { unsatisfiable: true as const };

  return { start, end: Math.min(end, size - 1) };
}

export async function GET(
  request: Request,
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

  const contentType = contentTypeFor(file);
  const range = parseRange(request.headers.get("range"), size);

  if (range && "unsatisfiable" in range) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" },
    });
  }

  /**
   * Range support is what makes uploaded video playable at all: iOS Safari will not start
   * a `<video>` whose server answers the initial range request with a plain 200, and
   * seeking anywhere in a clip depends on it everywhere else. It also means a 40MB video
   * is streamed in pieces instead of being read into memory in full, which the previous
   * `readFile` did for every request.
   */
  const start = range ? range.start : 0;
  const end = range ? range.end : size - 1;

  const stream = Readable.toWeb(
    createReadStream(target, { start, end })
  ) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    status: range ? 206 : 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
      ...(range ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
      // Filenames are random UUIDs and a replacement always gets a new one, so a stored
      // copy can never be stale.
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
