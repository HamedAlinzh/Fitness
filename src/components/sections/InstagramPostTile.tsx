import { Images, Play } from "lucide-react";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import { hashVariant } from "@/lib/placeholder-icon";
import { instagramPostUrl } from "@/lib/instagram";

export type InstagramPostData = {
  id: string;
  shortcode: string;
  type: string;
  thumbnail: string | null;
};

export default function InstagramPostTile({ post }: { post: InstagramPostData }) {
  const isReel = post.type === "REEL";

  return (
    <a
      href={instagramPostUrl(post.shortcode, post.type)}
      target="_blank"
      rel="noopener noreferrer"
      // Posts carry no stored caption, so the link itself provides the accessible name
      // and the cover image below is treated as decorative (empty alt) to avoid
      // screen readers announcing the same tile twice.
      aria-label={`مشاهده ${isReel ? "ریلز" : "پست"} در اینستاگرام`}
      className="group relative block aspect-square overflow-hidden rounded-2xl"
    >
      <PlaceholderMedia
        icon={isReel ? Play : Images}
        variant={hashVariant(post.id)}
        src={post.thumbnail}
        alt=""
        className="h-full w-full transition-transform duration-300 group-hover:scale-105"
      />
      {isReel && (
        <span className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}
    </a>
  );
}
