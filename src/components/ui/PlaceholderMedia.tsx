import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const gradients = [
  "from-red-300 to-red-500",
  "from-red-400 to-red-600",
  "from-red-200 to-red-400",
  "from-red-500 to-red-700",
];

export default function PlaceholderMedia({
  icon: Icon,
  variant = 0,
  src,
  alt = "",
  className,
  fit = "cover",
  sizes = "400px",
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
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
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
      <Icon className="h-8 w-8 text-white/90" strokeWidth={1.75} />
    </div>
  );
}
