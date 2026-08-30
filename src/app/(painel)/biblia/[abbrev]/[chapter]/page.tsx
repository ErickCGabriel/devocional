import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentUser, getBibleBook, getBibleChapter } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { FavoriteVerseButton } from "@/components/biblia/favorite-verse-button";

export default async function BibliaCapituloPage({
  params,
}: {
  params: Promise<{ abbrev: string; chapter: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { abbrev, chapter } = await params;
  const chapterNumber = Number(chapter);

  const book = await getBibleBook(decodeURIComponent(abbrev));
  if (!book || !Number.isInteger(chapterNumber) || chapterNumber < 1) notFound();

  const verses = await getBibleChapter(book.id, chapterNumber);
  if (verses.length === 0) notFound();

  const prevChapter = chapterNumber > 1 ? chapterNumber - 1 : null;
  const nextChapter = chapterNumber < book.chapter_count ? chapterNumber + 1 : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/biblia/${encodeURIComponent(book.abbrev)}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} /> {book.name}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {book.name} {chapterNumber}
        </h1>
        <div className="flex items-center gap-1">
          {prevChapter ? (
            <Link
              href={`/biblia/${encodeURIComponent(book.abbrev)}/${prevChapter}`}
              className="rounded-md p-1.5 text-muted hover:bg-accent-soft"
            >
              <ChevronLeft size={18} />
            </Link>
          ) : (
            <span className="p-1.5 text-border">
              <ChevronLeft size={18} />
            </span>
          )}
          {nextChapter ? (
            <Link
              href={`/biblia/${encodeURIComponent(book.abbrev)}/${nextChapter}`}
              className="rounded-md p-1.5 text-muted hover:bg-accent-soft"
            >
              <ChevronRight size={18} />
            </Link>
          ) : (
            <span className="p-1.5 text-border">
              <ChevronRight size={18} />
            </span>
          )}
        </div>
      </div>

      <Card className="space-y-3">
        {verses.map((v) => (
          <div key={v.id} className="flex items-start gap-2">
            <p className="flex-1 text-[15px] leading-relaxed text-foreground/90">
              <span className="mr-1.5 text-xs font-semibold text-primary">{v.verse}</span>
              {v.text}
            </p>
            <FavoriteVerseButton
              verseId={v.id}
              reference={`${book.name} ${chapterNumber}:${v.verse}`}
              text={v.text}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
