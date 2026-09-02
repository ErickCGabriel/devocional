import { redirect } from "next/navigation";
import Link from "next/link";
import { Flame, BookOpen, CalendarDays, HeartHandshake, Sparkles, Anchor, Star, Mountain, Flower2 } from "lucide-react";
import {
  getCurrentUser,
  getEntryByDate,
  getStreak,
  getWeeklyVerse,
  getMonthDayStatus,
  getUserPlanProgress,
  getReadingPlans,
  getPrayerRequests,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { todayISO, nowInBrazil } from "@/lib/utils";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

export default async function PainelPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const now = nowInBrazil();

  const [
    { data: profile },
    streak,
    weeklyVerse,
    dayStatus,
    planProgress,
    plans,
    prayerRequests,
  ] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    getStreak(user.id),
    getWeeklyVerse(),
    getMonthDayStatus(user.id, now.getUTCFullYear(), now.getUTCMonth() + 1),
    getUserPlanProgress(user.id),
    getReadingPlans(),
    getPrayerRequests(user.id),
  ]);

  const entry = await getEntryByDate(user.id, todayISO());
  const completedCount = [...dayStatus.values()].filter((s) => s === "completo").length;

  const dayOfYear = Math.ceil(
    (now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000,
  );
  const daysInYear = 365;
  const isLeap =
    (now.getUTCFullYear() % 4 === 0 && now.getUTCFullYear() % 100 !== 0) ||
    now.getUTCFullYear() % 400 === 0;

  const activePlan = planProgress.find((p) => !p.completed_at) ?? planProgress[0];
  const suggestedPlan = plans.find(
    (p) => !planProgress.some((pr) => pr.plan_id === p.id),
  );

  const activePrayers = prayerRequests.filter((p) => p.status === "ativo");
  const answeredPrayers = prayerRequests.filter((p) => p.status === "respondido");

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      iso,
      weekday: WEEKDAY_LABELS[d.getUTCDay()],
      done: dayStatus.get(iso) === "completo" || (iso === entry?.entry_date && entry?.completed),
    };
  });

  const firstName = (profile?.full_name ?? "").split(" ")[0] || "";

  return (
    <div className="mx-auto max-w-6xl space-y-3">
      <div className="theme-hero-banner relative -mx-4 overflow-hidden rounded-2xl px-4 pb-3 pt-4 md:-mx-8 md:px-8">
        <Flower2
          aria-hidden
          data-symbol="flower"
          size={52}
          strokeWidth={1.25}
          className="theme-symbol-accent absolute right-3 top-3 text-accent/30"
        />
        <Anchor
          aria-hidden
          data-symbol="anchor"
          size={52}
          strokeWidth={1.25}
          className="theme-symbol-accent absolute right-3 top-3 text-accent/25"
        />
        <Star
          aria-hidden
          data-symbol="star"
          size={48}
          strokeWidth={1.25}
          fill="currentColor"
          className="theme-symbol-accent absolute right-3 top-3 text-primary/20"
        />
        <Mountain
          aria-hidden
          data-symbol="mountain"
          size={52}
          strokeWidth={1.25}
          className="theme-symbol-accent absolute right-3 top-3 text-primary/20"
        />
        <h1 className="font-serif text-xl font-semibold text-foreground">
          Bom dia{firstName ? `, ${firstName}` : ""}! 💗
        </h1>
        {weeklyVerse && (
          <p className="mt-0.5 text-sm text-muted">
            &ldquo;{weeklyVerse.verse_text}&rdquo; — {weeklyVerse.verse_reference}
          </p>
        )}
      </div>

      <div
        aria-hidden
        className="theme-photo-banner -mx-4 h-40 rounded-2xl sm:h-52 md:-mx-8 md:h-64"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpen size={16} />
            Devocional de hoje
          </div>
          <p className="mt-1.5 text-lg font-medium text-foreground">
            {now.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <p className="text-xs text-muted">
            Dia {dayOfYear} de {isLeap ? 366 : daysInYear}
          </p>
          <Link href="/devocional" className="mt-3">
            <Button className="w-full sm:w-auto">
              {entry?.completed ? "Ver devocional de hoje" : "Começar devocional de hoje →"}
            </Button>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Flame size={16} />
            Sequência atual
          </div>
          <p className="mt-1.5 text-2xl font-semibold text-foreground">
            {streak.current_streak} {streak.current_streak === 1 ? "dia" : "dias"}
          </p>
          <p className="text-xs text-muted">Vamos continuar!</p>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs text-muted">
            {last7.map((d) => (
              <div key={d.iso} className="flex flex-col items-center gap-1">
                <span>{d.weekday}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    d.done ? "bg-success text-white" : "bg-accent-soft text-muted"
                  }`}
                >
                  {d.done ? "✓" : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpen size={16} />
            Plano atual
          </div>
          {activePlan ? (
            <>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {activePlan.reading_plan?.title}
              </p>
              <p className="text-xs text-muted">
                Progresso{" "}
                {Math.round(
                  (activePlan.completed_days.length /
                    (activePlan.reading_plan?.total_days ?? 1)) *
                    100,
                )}
                %
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-sm text-muted">Nenhum plano iniciado.</p>
          )}
          <Link href="/planos" className="mt-2 block">
            <Button size="sm" variant="secondary" className="w-full">
              Ver plano
            </Button>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays size={16} />
            Calendário
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {completedCount} dias concluídos este mês
          </p>
          <Link href="/calendario" className="mt-2 block">
            <Button size="sm" variant="secondary" className="w-full">
              Ver calendário
            </Button>
          </Link>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <HeartHandshake size={16} />
            Oração por pessoas
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {activePrayers.length} pedidos ativos · {answeredPrayers.length} respondidos
          </p>
          <Link href="/oracao" className="mt-2 block">
            <Button size="sm" variant="secondary" className="w-full">
              Ver pedidos
            </Button>
          </Link>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <MonthCalendar
            year={now.getFullYear()}
            month={now.getMonth() + 1}
            dayStatus={dayStatus}
            todayISO={todayISO()}
          />
        </Card>

        {weeklyVerse && (
          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              Versículo da semana
            </div>
            <p className="mt-2 font-script text-xl leading-snug text-foreground">
              &ldquo;{weeklyVerse.verse_text}&rdquo;
            </p>
            <p className="mt-1.5 text-sm font-medium text-muted">
              {weeklyVerse.verse_reference}
            </p>
          </Card>
        )}
      </div>

      {suggestedPlan && (
        <Card className="flex flex-col items-center justify-between gap-3 bg-accent-soft/60 p-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="shrink-0 text-primary" />
            <div>
              <p className="font-serif text-base font-semibold text-foreground">
                Dica de plano para você
              </p>
              <p className="text-sm text-muted">
                Que tal o plano &ldquo;{suggestedPlan.title}&rdquo;? {suggestedPlan.description}
              </p>
            </div>
          </div>
          <Link href={`/planos/${suggestedPlan.slug}`}>
            <Button size="sm" className="shrink-0">Ver plano</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
