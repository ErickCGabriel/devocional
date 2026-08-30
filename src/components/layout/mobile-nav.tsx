"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/lib/actions-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/painel", label: "Início" },
  { href: "/devocional", label: "Devocional" },
  { href: "/biblia", label: "Bíblia" },
  { href: "/planos", label: "Planos de leitura" },
  { href: "/calendario", label: "Calendário" },
  { href: "/oracao", label: "Oração por pessoas" },
  { href: "/notas", label: "Notas" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/estatisticas", label: "Estatísticas" },
  { href: "/assinatura", label: "Assinatura" },
  { href: "/configuracoes", label: "Configurações" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-surface md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/painel" className="font-serif text-lg font-semibold text-primary">
          ✝ Meu Devocional
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className="rounded-md p-1.5 text-foreground hover:bg-accent-soft"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent-soft",
              )}
            >
              {item.label}
            </Link>
          ))}
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-accent-soft"
            >
              Sair
            </button>
          </form>
        </nav>
      )}
    </div>
  );
}
