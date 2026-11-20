import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-red-500 text-background shadow-lg shadow-red-500/30 hover:bg-red-400 hover:shadow-red-500/50",
  secondary:
    "border border-white/15 text-ink-900 hover:border-red-400 hover:text-red-400",
  ghost: "text-red-400 hover:bg-red-500/10",
  light: "bg-white text-red-700 hover:bg-white/90",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all active:scale-[0.98]";

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
