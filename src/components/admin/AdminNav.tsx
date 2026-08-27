"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  Images,
  Inbox,
  Receipt,
  Tag,
  UserRound,
  BarChart3,
  Newspaper,
  AtSign,
} from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/testimonials", label: "نظرات", icon: MessageSquareQuote },
  { href: "/admin/media", label: "تصاویر", icon: Images },
  { href: "/admin/blog", label: "بلاگ", icon: Newspaper },
  { href: "/admin/instagram", label: "اینستاگرام", icon: AtSign },
  { href: "/admin/leads", label: "درخواست‌های مشاوره", icon: Inbox },
  { href: "/admin/packages", label: "پلن‌ها و قیمت", icon: Tag },
  { href: "/admin/orders", label: "لینک‌های پرداخت", icon: Receipt },
  { href: "/admin/about", label: "درباره من", icon: UserRound },
  { href: "/admin/analytics", label: "بازدیدها", icon: BarChart3 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        // `/admin` would otherwise match every sub-page.
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-red-500 text-white"
                : "text-ink-500 hover:bg-red-50 hover:text-red-600"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
