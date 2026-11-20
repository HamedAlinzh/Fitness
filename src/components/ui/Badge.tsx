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
        "inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-300",
        className
      )}
    >
      {children}
    </span>
  );
}
