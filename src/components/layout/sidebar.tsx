"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  BookMarked,
  ListChecks,
  CalendarDays,
  HeartHandshake,
  StickyNote,
  Star,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOutAction } from "@/lib/actions-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/painel", label: "Início", icon: Home },
  { href: "/devocional", label: "Devocional", icon: BookOpen },
  { href: "/biblia", label: "Bíblia", icon: BookMarked },
  { href: "/planos", label: "Planos de leitura", icon: ListChecks },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/oracao", label: "Oração por pessoas", icon: HeartHandshake },
  { href: "/notas", label: "Notas", icon: StickyNote },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
];

export function Sidebar({ isPremium }: { isPremium: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
      <Link
        href="/painel"
        className="mb-6 flex items-center gap-2 px-2 font-serif text-lg font-semibold text-primary"
      >
        <span aria-hidden className="text-xl">
          ✝
        </span>
        Meu Devocional
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent-soft",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {!isPremium && (
          <Link
            href="/assinatura"
            className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-accent px-3 py-2.5 text-sm font-medium text-primary hover:bg-accent-soft"
          >
            <Sparkles size={18} />
            Seja premium
          </Link>
        )}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
        <Link
          href="/perfil"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/perfil"
              ? "bg-primary text-primary-foreground"
              : "text-foreground/80 hover:bg-accent-soft",
          )}
        >
          <User size={18} />
          Perfil
        </Link>
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/configuracoes"
              ? "bg-primary text-primary-foreground"
              : "text-foreground/80 hover:bg-accent-soft",
          )}
        >
          <Settings size={18} />
          Configurações
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent-soft"
          >
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
