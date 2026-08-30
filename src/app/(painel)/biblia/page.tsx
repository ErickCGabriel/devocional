import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { getCurrentUser, getBibleBooks } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function BibliaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const books = await getBibleBooks();
  const at = books.filter((b) => b.testament === "AT");
  const nt = books.filter((b) => b.testament === "NT");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Bíblia</h1>
        <p className="text-sm text-muted">
          Almeida 1911 · escolha um livro ou busque uma palavra ou trecho.
        </p>
      </div>

      <Card>
        <form action="/biblia/buscar" className="flex gap-2">
          <Input name="q" placeholder="Buscar na Bíblia... (ex: amor, Salmo 23)" />
          <Button type="submit" size="md">
            <Search size={16} />
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Antigo Testamento</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {at.map((book) => (
            <Link
              key={book.id}
              href={`/biblia/${encodeURIComponent(book.abbrev)}`}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-center text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              {book.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Novo Testamento</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {nt.map((book) => (
            <Link
              key={book.id}
              href={`/biblia/${encodeURIComponent(book.abbrev)}`}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-center text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              {book.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
