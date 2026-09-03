import Link from "next/link";
import { LayoutDashboard, Users, BookText, ListChecks, ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/conteudo", label: "Devocionais", icon: BookText },
  { href: "/admin/planos", label: "Planos de leitura", icon: ListChecks },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 md:flex-row">
      <aside className="w-full shrink-0 border-b border-zinc-200 bg-white px-4 py-4 md:h-screen md:w-56 md:border-b-0 md:border-r md:px-3 md:py-6">
        <div className="mb-4 px-2 font-serif text-base font-semibold text-zinc-900 md:mb-6">
          Painel Admin
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-zinc-200 pt-4 md:mt-6">
          <Link
            href="/painel"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ArrowLeft size={16} />
            Voltar ao app
          </Link>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
