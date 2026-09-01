import { redirect } from "next/navigation";
import { Anchor, Star } from "lucide-react";
import {
  getCurrentUser,
  getTodayDevotional,
  getOrCreateEntry,
  getEntryQuestionsWithAnswers,
  isFavorited,
} from "@/lib/queries";
import { DevotionalForm } from "@/components/devocional/devotional-form";
import { Card } from "@/components/ui/card";
import { FavoriteHeartButton } from "@/components/ui/favorite-heart-button";
import { getSticker } from "@/lib/stickers";
import { todayISO } from "@/lib/utils";

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

  const entryDate = todayISO();
  const [entry, verseFavorited] = await Promise.all([
    getOrCreateEntry(devotional.id, user.id, entryDate),
    isFavorited(user.id, "devocional", devotional.id),
  ]);
  const { reflection, application, prayer } = await getEntryQuestionsWithAnswers(entry);
  const sticker = getSticker(entry.sticker_key);

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

      <div className="theme-hero-banner relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft to-surface px-6 py-10 text-center">
        <Anchor
          aria-hidden
          data-symbol="anchor"
          size={140}
          strokeWidth={1}
          className="theme-symbol-accent absolute -bottom-6 left-1/2 -translate-x-1/2 text-accent/15"
        />
        <Star
          aria-hidden
          data-symbol="star"
          size={130}
          strokeWidth={1}
          fill="currentColor"
          className="theme-symbol-accent absolute -bottom-6 left-1/2 -translate-x-1/2 text-primary/10"
        />
        <FavoriteHeartButton
          reference={devotional.verse_reference}
          text={devotional.verse_text}
          source="devocional"
          sourceId={devotional.id}
          initialFavorited={verseFavorited}
          className="absolute right-4 top-4"
        />
        {sticker && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sticker.src}
            alt={sticker.label}
            width={40}
            height={40}
            className="absolute left-4 top-4"
          />
        )}
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

      <div className="theme-journal-card rounded-2xl">
        <DevotionalForm
          entryId={entry.id}
          devotionalId={devotional.id}
          entryDate={entryDate}
          reflectionQuestions={reflection}
          applicationQuestions={application}
          prayerQuestions={prayer}
          alreadyCompleted={entry.completed}
          initialFields={{
            gratitude: entry.gratitude ?? "",
            notes: entry.notes ?? "",
          }}
          initialStickerKey={entry.sticker_key}
        />
      </div>
    </div>
  );
}
