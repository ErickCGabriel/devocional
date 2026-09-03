import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminFeaturedVerses } from "@/lib/queries-admin";
import { DeleteVerseButton } from "./delete-button";

export default async function AdminFeaturedVersesPage() {
  const verses = await getAdminFeaturedVerses();

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-zinc-900">Versículo da semana</h1>
          <p className="text-sm text-zinc-500">
            {verses.length} cadastrados — um é sorteado por semana entre esses.
            {verses.length < 12 && (
              <span className="ml-1 font-medium text-amber-600">
                (vale ter pelo menos uns 12 pra não repetir toda hora)
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/versiculos/novo"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> Novo versículo
        </Link>
      </div>

      <div className="space-y-2">
        {verses.map((v) => (
          <div
            key={v.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div>
              <p className="text-sm text-zinc-800">&ldquo;{v.verse_text}&rdquo;</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">{v.verse_reference}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/admin/versiculos/${v.id}`}
                className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Editar
              </Link>
              <DeleteVerseButton id={v.id} />
            </div>
          </div>
        ))}
        {verses.length === 0 && (
          <p className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-400">
            Nenhum versículo cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
