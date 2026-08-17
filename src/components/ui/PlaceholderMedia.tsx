import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const gradients = [
  "from-pink-300 to-pink-500",
  "from-pink-400 to-pink-600",
  "from-pink-200 to-pink-400",
  "from-pink-500 to-pink-700",
];

export default function PlaceholderMedia({
  icon: Icon,
  variant = 0,
  src,
  alt = "",
  className,
}: {
  icon: LucideIcon;
  variant?: number;
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes="400px" className="object-cover" />
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
