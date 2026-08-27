"use client";

import { useState, type ChangeEvent, type ComponentProps } from "react";
import { compressImageFile } from "@/lib/image-compress";

type Props = Omit<ComponentProps<"input">, "type" | "onChange"> & {
  /** Told when the picked file is being re-encoded, so the form can hold its submit. */
  onBusyChange?: (busy: boolean) => void;
};

/**
 * A file input that shrinks the picked photo before it is submitted.
 *
 * Video passes straight through — `compressImageFile` returns `null` for anything that is
 * not an image, and there is no in-browser transcode worth doing here.
 *
 * The swap is done by writing back into `input.files`, so the browser's own `FormData`
 * still carries the file and the form keeps working untouched when this never runs — no
 * JS, an old browser, an image the browser cannot decode. See `src/lib/image-compress.ts`.
 */
export default function MediaFileInput({ onBusyChange, ...props }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // Captured synchronously: `currentTarget` is not readable after the first await.
    const input = event.currentTarget;
    const picked = input.files?.[0];
    if (!picked) return;

    setBusy(true);
    onBusyChange?.(true);

    try {
      const smaller = await compressImageFile(picked);
      // Only swap if the coach hasn't picked a different file in the meantime.
      if (smaller && input.files?.[0] === picked) {
        const transfer = new DataTransfer();
        transfer.items.add(smaller);
        input.files = transfer.files;
      }
    } catch {
      // Leave the original file in place; the server validates it either way.
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <>
      <input {...props} type="file" onChange={handleChange} />
      {busy && (
        <span className="text-xs text-ink-500">در حال آماده‌سازی فایل…</span>
      )}
    </>
  );
}
