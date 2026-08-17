import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700",
        className
      )}
    >
      {children}
    </span>
  );
}
