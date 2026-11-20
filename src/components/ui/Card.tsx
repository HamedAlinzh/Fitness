import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.06] bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/10",
        className
      )}
    >
      {children}
    </div>
  );
}
