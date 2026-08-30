import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import {
  getCurrentUser,
  getEntryByDate,
  getDevotionalById,
  getEntryQuestionsWithAnswers,
} from "@/lib/queries";
import { Card, Badge } from "@/components/ui/card";
import { getSticker } from "@/lib/stickers";
import { todayISO } from "@/lib/utils";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function DevocionalHistoricoPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { date } = await params;
  if (!DATE_RE.test(date)) notFound();
  if (date === todayISO()) redirect("/devocional");

  const entry = await getEntryByDate(user.id, date);
  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (!entry) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href="/calendario"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={16} /> Calendário
        </Link>
        <Card className="text-center">
          <h1 className="font-serif text-lg font-semibold">{formattedDate}</h1>
          <p className="mt-2 text-sm text-muted">
            Nenhum registro de devocional neste dia.
          </p>
        </Card>
      </div>
    );
  }

  const [devotional, { reflection, application, prayer }] = await Promise.all([
    getDevotionalById(entry.devotional_id),
    getEntryQuestionsWithAnswers(entry),
  ]);
  const sticker = getSticker(entry.sticker_key);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/calendario"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} /> Calendário
      </Link>

      <div className="flex items-center gap-2">
        {sticker && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sticker.src} alt={sticker.label} width={28} height={28} />
        )}
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {formattedDate}
        </h1>
        {entry.completed ? (
          <Badge className="bg-success/15 text-success">
            <Check size={11} className="mr-1" /> Concluído
          </Badge>
        ) : (
          <Badge className="bg-warning/15 text-warning">Parcial</Badge>
        )}
      </div>

      {devotional && (
        <Card>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Leitura
          </div>
          <h2 className="font-serif text-lg font-semibold">{devotional.title}</h2>
          <p className="mt-1 text-sm text-foreground/80">{devotional.verse_reference}</p>
          <p className="mt-1 text-sm italic text-muted">&ldquo;{devotional.verse_text}&rdquo;</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <QuestionGroup title="Reflexão" items={reflection} />
        <QuestionGroup title="Aplicação" items={application} />
      </div>
      <QuestionGroup title="Oração" items={prayer} />

      {entry.gratitude && (
        <Card>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Agradecer
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground/90">{entry.gratitude}</p>
        </Card>
      )}

      {entry.notes && (
        <Card>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Anotações livres
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground/90">{entry.notes}</p>
        </Card>
      )}
    </div>
  );
}

function QuestionGroup({
  title,
  items,
}: {
  title: string;
  items: { id: string; question: string; answer: string }[];
}) {
  const answered = items.filter((i) => i.answer.trim().length > 0);
  if (answered.length === 0) return null;

  return (
    <Card>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {title}
      </div>
      <div className="space-y-3">
        {answered.map((item) => (
          <div key={item.id}>
            <p className="text-xs text-muted">{item.question}</p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/90">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
