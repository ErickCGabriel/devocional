import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminUserDetail } from "@/lib/queries-admin";
import { PlanForm } from "./plan-form";

const RELIGIAO_LABELS: Record<string, string> = {
  catolico: "Católico",
  evangelico: "Evangélico",
  espirita: "Espírita",
  outra_crista: "Outra cristã",
  outra_religiao: "Outra religião",
  sem_religiao: "Sem religião",
  prefiro_nao_dizer: "Prefiro não dizer",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getAdminUserDetail(id);
  if (!detail) notFound();

  const { email, createdAt, profile, subscription, recentEntries } = detail;

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/usuarios"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Usuários
      </Link>

      <div>
        <h1 className="font-serif text-xl font-semibold text-zinc-900">
          {profile?.full_name || "(sem nome)"}
        </h1>
        <p className="text-sm text-zinc-500">{email}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Cadastro</p>
          <p className="mt-1 text-sm text-zinc-900">
            {new Date(createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Tema atual</p>
          <p className="mt-1 text-sm text-zinc-900">{profile?.theme ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Idade</p>
          <p className="mt-1 text-sm text-zinc-900">{profile?.idade ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Religião</p>
          <p className="mt-1 text-sm text-zinc-900">
            {profile?.religiao ? (RELIGIAO_LABELS[profile.religiao] ?? profile.religiao) : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-zinc-900">Plano</p>
        <p className="mb-3 text-sm text-zinc-500">
          Status atual: <span className="font-medium text-zinc-800">{subscription?.plan ?? "free"}</span>
          {" · "}
          {subscription?.status ?? "active"}
          {subscription?.stripe_customer_id && (
            <span className="block text-xs text-zinc-400">
              Stripe customer: {subscription.stripe_customer_id}
            </span>
          )}
        </p>
        <PlanForm userId={id} currentPlan={subscription?.plan ?? "free"} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-zinc-900">Últimos devocionais</p>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhum registro ainda.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {recentEntries.map((e) => (
              <li key={e.entry_date} className="flex items-center justify-between">
                <span className="text-zinc-700">
                  {new Date(e.entry_date + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                <span className={e.completed ? "text-emerald-600" : "text-amber-600"}>
                  {e.completed ? "Concluído" : "Parcial"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
