import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-red-500 text-white shadow-lg shadow-red-300/60 hover:bg-red-600",
  secondary:
    "border border-red-200 text-red-600 hover:bg-red-50",
  ghost: "text-red-600 hover:bg-red-50",
  light: "bg-white text-red-600 hover:bg-red-50",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors";

export default function Button({
  href,
  external = false,
  variant = "primary",
  className,
  children,
  onClick,
  type = "button",
}: {
  href?: string;
  /** Render a plain anchor that opens in a new tab, for off-site links. */
  external?: boolean;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

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
