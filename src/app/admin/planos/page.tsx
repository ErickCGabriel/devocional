import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminReadingPlans } from "@/lib/queries-admin";
import { DeletePlanButton } from "./delete-plan-button";

export default async function AdminReadingPlansPage() {
  const plans = await getAdminReadingPlans();

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-zinc-900">Planos de leitura</h1>
          <p className="text-sm text-zinc-500">{plans.length} cadastrados</p>
        </div>
        <Link
          href="/admin/planos/novo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> Novo plano
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Dias cadastrados</th>
              <th className="px-4 py-3 font-medium">Premium</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/planos/${p.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-zinc-400">/{p.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.daysRegistered < p.total_days
                        ? "font-medium text-amber-600"
                        : "text-zinc-600"
                    }
                  >
                    {p.daysRegistered} / {p.total_days}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{p.is_premium ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-right">
                  <DeletePlanButton id={p.id} />
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum plano cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
