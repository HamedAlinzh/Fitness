import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// Deep tones rather than the bright accent: on the dark site a wall of hot-pink tiles
// out-shouts the content around it. The icon carries the colour instead.
const gradients = [
  "from-red-900 to-surface-2",
  "from-red-800/80 to-red-900/40",
  "from-surface-2 to-red-900",
  "from-red-900/70 via-surface-2 to-red-800/60",
];

export default function PlaceholderMedia({
  icon: Icon,
  variant = 0,
  src,
  alt = "",
  className,
  fit = "cover",
  sizes = "400px",
  priority = false,
}: {
  icon: LucideIcon;
  variant?: number;
  src?: string | null;
  alt?: string;
  className?: string;
  /**
   * `contain` shows the whole picture inside the box instead of filling it, for places
   * where cropping loses the subject — the gallery, where the coach's photos are a mix of
   * portrait and landscape. Cover stays the default so the cards that were designed
   * around a filled tile (blog covers, the about photo) are unchanged.
   */
  fit?: "cover" | "contain";
  sizes?: string;
  /** For an above-the-fold image (the hero), so it isn't lazy-loaded. */
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }

  const gradient = gradients[variant % gradients.length];

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <Icon className="h-8 w-8 text-red-300/80" strokeWidth={1.75} />
    </div>
  );
}
