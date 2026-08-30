import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser, searchBibleVerses } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FavoriteVerseButton } from "@/components/biblia/favorite-verse-button";

export default async function BibliaBuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchBibleVerses(query) : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/biblia"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} /> Bíblia
      </Link>

      <Card>
        <form action="/biblia/buscar" className="flex gap-2">
          <Input name="q" defaultValue={query} placeholder="Buscar na Bíblia..." />
          <Button type="submit">Buscar</Button>
        </form>
      </Card>

      {query && (
        <p className="text-sm text-muted">
          {results.length} resultado{results.length === 1 ? "" : "s"} para &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-2">
        {results.map((v) => (
          <Card key={v.id} className="flex items-start gap-2">
            <div className="flex-1">
              <Link
                href={`/biblia/${encodeURIComponent(v.book?.abbrev ?? "")}/${v.chapter}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {v.book?.name} {v.chapter}:{v.verse}
              </Link>
              <p className="mt-1 text-sm text-foreground/90">{v.text}</p>
            </div>
            <FavoriteVerseButton
              verseId={v.id}
              reference={`${v.book?.name} ${v.chapter}:${v.verse}`}
              text={v.text}
            />
          </Card>
        ))}
        {query && results.length === 0 && (
          <p className="text-sm text-muted">Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  );
}
