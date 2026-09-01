"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BookMarked, CalendarDays, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const tabItems = [
  { href: "/painel", label: "Início", icon: Home },
  { href: "/devocional", label: "Devocional", icon: BookOpen },
  { href: "/biblia", label: "Bíblia", icon: BookMarked },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/notas", label: "Notas", icon: StickyNote },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
              active ? "text-primary" : "text-muted",
            )}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
