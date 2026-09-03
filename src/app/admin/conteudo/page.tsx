import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminDevotionals } from "@/lib/queries-admin";
import { DeleteDevotionalButton } from "./delete-button";

export default async function AdminContentPage() {
  const devotionals = await getAdminDevotionals();
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = devotionals[0]?.devotional_date;
  const runwayDays = lastDate
    ? Math.round(
        (new Date(lastDate + "T00:00:00").getTime() - new Date(today + "T00:00:00").getTime()) /
          86400000,
      )
    : 0;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-zinc-900">Devocionais</h1>
          <p className="text-sm text-zinc-500">
            {devotionals.length} cadastrados
            {lastDate && (
              <>
                {" · conteúdo cobre até "}
                {new Date(lastDate + "T00:00:00").toLocaleDateString("pt-BR")}
                {runwayDays <= 7 && (
                  <span className="ml-1 font-medium text-amber-600">
                    (só {runwayDays} dia{runwayDays === 1 ? "" : "s"} de folga — cadastre mais em breve)
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <Link
          href="/admin/conteudo/novo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> Novo devocional
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Versículo</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {devotionals.map((d) => (
              <tr key={d.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                  {new Date(d.devotional_date + "T00:00:00").toLocaleDateString("pt-BR")}
                  {d.devotional_date === today && (
                    <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      hoje
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/conteudo/${d.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{d.verse_reference}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteDevotionalButton id={d.id} />
                </td>
              </tr>
            ))}
            {devotionals.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum devocional cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
