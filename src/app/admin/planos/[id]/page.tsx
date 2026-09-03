import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { getAdminReadingPlanById, getAdminReadingPlanDays } from "@/lib/queries-admin";
import { updateReadingPlanAction } from "@/lib/actions-admin";
import { PlanForm } from "../plan-form";
import { DeleteDayButton } from "./delete-day-button";

export default async function ReadingPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, days] = await Promise.all([
    getAdminReadingPlanById(id),
    getAdminReadingPlanDays(id),
  ]);
  if (!plan) notFound();

  const action = updateReadingPlanAction.bind(null, id);
  const missingDays = plan.total_days - days.length;

  return (
    <div className="max-w-3xl space-y-8">
      <Link
        href="/admin/planos"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Planos de leitura
      </Link>

      <div>
        <h1 className="font-serif text-xl font-semibold text-zinc-900">{plan.title}</h1>
        <PlanForm
          action={action}
          submitLabel="Salvar alterações"
          initialValues={{
            slug: plan.slug,
            title: plan.title,
            description: plan.description,
            total_days: plan.total_days,
            is_premium: plan.is_premium,
            cover_image_url: plan.cover_image_url,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Dias do plano — {days.length} / {plan.total_days}
            </p>
            {missingDays > 0 && (
              <p className="text-xs font-medium text-amber-600">
                Faltam {missingDays} dia{missingDays === 1 ? "" : "s"} de conteúdo.
              </p>
            )}
          </div>
          <Link
            href={`/admin/planos/${id}/dias/novo`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={15} /> Novo dia
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Dia</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Passagem</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-600">{d.day_number}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/planos/${id}/dias/${d.id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {d.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{d.passage_reference}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteDayButton dayId={d.id} planId={id} />
                  </td>
                </tr>
              ))}
              {days.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                    Nenhum dia cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
