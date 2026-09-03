import { Users, Sparkles, BookOpenCheck, BookText } from "lucide-react";
import { getAdminStats } from "@/lib/queries-admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Usuários cadastrados", value: stats.totalUsers, icon: Users },
    { label: "Usuários premium", value: stats.premiumUsers, icon: Sparkles },
    { label: "Devocionais respondidos hoje", value: stats.entriesToday, icon: BookOpenCheck },
    { label: "Devocionais cadastrados", value: stats.devotionalsCount, icon: BookText },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-xl font-semibold text-zinc-900">Visão geral</h1>
        <p className="text-sm text-zinc-500">Resumo rápido do estado do app.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-zinc-200 bg-white p-4">
              <Icon size={18} className="text-zinc-400" />
              <p className="mt-2 text-2xl font-semibold text-zinc-900">{c.value}</p>
              <p className="text-xs text-zinc-500">{c.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
