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
        "rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/50 transition-shadow hover:shadow-lg hover:shadow-pink-200/50",
        className
      )}
    >
      {children}
    </div>
  );
}
