import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getTodayDevotional,
  getEntryForDevotional,
} from "@/lib/queries";
import { DevotionalForm } from "@/components/devocional/devotional-form";
import { Card } from "@/components/ui/card";

export default async function DevocionalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { devotional, isToday } = await getTodayDevotional();

  if (!devotional) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-xl font-semibold">
          Nenhum devocional disponível ainda
        </h1>
        <p className="mt-2 text-sm text-muted">
          Volte em breve — novos conteúdos são publicados regularmente.
        </p>
      </Card>
    );
  }

  const entry = await getEntryForDevotional(devotional.id, user.id);
  const entryDate = entry?.entry_date ?? devotional.devotional_date;

  const formattedDate = new Date(
    devotional.devotional_date + "T00:00:00",
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Devocional do dia
        </h1>
        <p className="text-sm text-muted">
          {formattedDate}
          {!isToday && " · devocional mais recente disponível"}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft to-surface px-6 py-10 text-center">
        <p className="font-script text-3xl leading-snug text-primary sm:text-4xl">
          &ldquo;{devotional.verse_text}&rdquo;
        </p>
        <p className="mt-3 text-sm font-medium text-foreground/80">
          {devotional.verse_reference}
        </p>
      </div>

      <Card>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Leitura de hoje
        </div>
        <h2 className="font-serif text-lg font-semibold">{devotional.title}</h2>
        <p className="mt-2 text-sm text-foreground/80">{devotional.reading}</p>
      </Card>

      <DevotionalForm
        devotionalId={devotional.id}
        entryDate={entryDate}
        alreadyCompleted={entry?.completed ?? false}
        initial={{
          reflection: entry?.reflection ?? "",
          application: entry?.application ?? "",
          prayer: entry?.prayer ?? "",
          gratitude: entry?.gratitude ?? "",
          notes: entry?.notes ?? "",
        }}
      />
    </div>
  );
}
