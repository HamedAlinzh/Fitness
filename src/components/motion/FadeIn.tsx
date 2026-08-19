import type { ReactNode } from "react";

export default function FadeIn({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  mode?: "view" | "mount";
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
