import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { type GalleryItemData, isVideoItem } from "@/components/sections/GalleryTile";

export const GALLERY_ANCHOR = "gallery";

export function lightboxHref(item: GalleryItemData) {
  return `#media-${item.id}`;
}

/**
 * Fullscreen viewer for the gallery, built on `:target` rather than React state.
 *
 * Opening a photo is a link to `#media-<id>`; the `[data-lightbox]` rules in globals.css
 * show the panel whose id matches the URL fragment. That means it works on the very first
 * paint — before hydration, and with JS disabled entirely — which is the same reason the
 * consultation form's stepper is CSS-only and the visit counter is an `<img>` rather than
 * a script. A React lightbox would be a dead tap for as long as hydration takes, which on
 * a throttled mobile connection is seconds.
 *
 * It also gets the back button for free: each opened item is a real history entry.
 */
export default function GalleryLightbox({ items }: { items: GalleryItemData[] }) {
  // Only items that actually have a file can be opened; the seeded placeholder rows have
  // nothing to show at full size.
  const viewable = items.filter((item) => item.url);
  if (viewable.length === 0) return null;

  const closeHref = `#${GALLERY_ANCHOR}`;

  return (
    <>
      {viewable.map((item, index) => {
        const previous = viewable[(index - 1 + viewable.length) % viewable.length];
        const next = viewable[(index + 1) % viewable.length];
        const isVideo = isVideoItem(item);

        return (
          <div
            key={item.id}
            id={`media-${item.id}`}
            data-lightbox
            className="fixed inset-0 z-50 items-center justify-center bg-black/92 p-4"
          >
            {/* A backdrop that is itself a link, so tapping outside closes without JS. */}
            <a
              href={closeHref}
              aria-label="بستن"
              className="absolute inset-0 cursor-default"
            />

            <figure className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
              {isVideo ? (
                <video
                  src={item.url!}
                  controls
                  playsInline
                  /* Nothing is fetched until this panel is opened and play is tapped. */
                  preload="none"
                  className="max-h-[78vh] w-full rounded-2xl bg-black"
                />
              ) : (
                <div className="relative h-[78vh] w-full">
                  <Image
                    src={item.url!}
                    alt={item.caption}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}
              <figcaption className="text-center text-sm font-medium text-white/90">
                {item.caption}
              </figcaption>
            </figure>

            <a
              href={closeHref}
              aria-label="بستن"
              className="absolute top-4 end-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </a>

            {viewable.length > 1 && (
              <>
                {/* Logical sides: in this RTL document `start` is the right edge. */}
                <a
                  href={lightboxHref(previous)}
                  aria-label="قبلی"
                  className="absolute top-1/2 start-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:start-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </a>
                <a
                  href={lightboxHref(next)}
                  aria-label="بعدی"
                  className="absolute top-1/2 end-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:end-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </a>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
