import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser, getBibleBook } from "@/lib/queries";
import { Card } from "@/components/ui/card";

export default async function BibliaLivroPage({
  params,
}: {
  params: Promise<{ abbrev: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { abbrev } = await params;
  const book = await getBibleBook(decodeURIComponent(abbrev));
  if (!book) notFound();

  const chapters = Array.from({ length: book.chapter_count }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/biblia"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1 className="font-serif text-2xl font-semibold text-foreground">{book.name}</h1>

      <Card>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {chapters.map((chapter) => (
            <Link
              key={chapter}
              href={`/biblia/${encodeURIComponent(book.abbrev)}/${chapter}`}
              className="flex aspect-square items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              {chapter}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
