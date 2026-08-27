"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import GalleryTile, { type GalleryItemData } from "@/components/sections/GalleryTile";
import GalleryLightbox, {
  GALLERY_ANCHOR,
  lightboxHref,
} from "@/components/sections/GalleryLightbox";
import FadeIn from "@/components/motion/FadeIn";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "all", label: "همه" },
  { key: "IMAGE", label: "تصاویر" },
  { key: "VIDEO", label: "ویدیوها" },
] as const;

export default function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("all");

  const filtered = active === "all" ? items : items.filter((item) => item.type === active);

  return (
    <section id={GALLERY_ANCHOR} className="py-16">
      <Container className="flex flex-col gap-10">
        <div className="flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition-colors",
                active === tab.key
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-500">فعلاً موردی برای نمایش نیست.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((item, index) => (
              <FadeIn key={item.id} delay={(index % 8) * 0.05}>
                {item.url ? (
                  <a
                    href={lightboxHref(item)}
                    aria-label={`نمایش تمام‌صفحه: ${item.caption}`}
                    className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <GalleryTile item={item} />
                  </a>
                ) : (
                  <GalleryTile item={item} />
                )}
              </FadeIn>
            ))}
          </div>
        )}
      </Container>

      {/* Rendered from the full list, not the filtered one, so a link never points at a
          panel that the current tab happened to remove from the page. */}
      <GalleryLightbox items={items} />
    </section>
  );
}
