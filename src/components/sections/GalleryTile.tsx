import { Camera, Video as VideoIcon, Play } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";

export type GalleryItemData = {
  id: string;
  type: string;
  url: string | null;
  caption: string;
};

export function isVideoItem(item: GalleryItemData) {
  return item.type === "VIDEO";
}

export default function GalleryTile({ item }: { item: GalleryItemData }) {
  const isVideo = isVideoItem(item);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-2 transition-colors hover:border-red-500/50">
      {isVideo && item.url ? (
        <video
          /**
           * The tile is a still frame, not a player: `preload="metadata"` plus the `#t=0.1`
           * media fragment is what gets a frame painted rather than a black rectangle,
           * since a video with no poster otherwise shows nothing until it is played.
           */
          src={`${item.url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="h-full w-full object-contain"
        />
      ) : (
        <PlaceholderMedia
          icon={isVideo ? VideoIcon : Camera}
          variant={hashVariant(item.id)}
          src={item.url}
          alt={item.caption}
          fit="contain"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {isVideo && (
        <span className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-background shadow-lg shadow-red-500/40">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-xs font-medium text-white">{item.caption}</span>
      </div>
    </div>
  );
}
