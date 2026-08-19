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
        "rounded-3xl border border-red-100 bg-white p-6 shadow-sm shadow-red-100/50 transition-shadow hover:shadow-lg hover:shadow-red-200/50",
        className
      )}
    >
      {children}
    </div>
  );
}
