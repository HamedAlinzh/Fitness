import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-pink-500 text-white shadow-lg shadow-pink-300/60 hover:bg-pink-600",
  secondary:
    "border border-pink-200 text-pink-600 hover:bg-pink-50",
  ghost: "text-pink-600 hover:bg-pink-50",
  light: "bg-white text-pink-600 hover:bg-pink-50",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors";

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  onClick,
  type = "button",
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
