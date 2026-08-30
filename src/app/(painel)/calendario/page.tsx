import { redirect } from "next/navigation";
import { getCurrentUser, getCompletedDatesInMonth, getStreak } from "@/lib/queries";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { Card } from "@/components/ui/card";
import { todayISO } from "@/lib/utils";
import { Flame } from "lucide-react";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year) || now.getFullYear();
  const month = Number(params.month) || now.getMonth() + 1;

  const [entries, streak] = await Promise.all([
    getCompletedDatesInMonth(user.id, year, month),
    getStreak(user.id),
  ]);

  const completedDates = new Set(entries.map((e) => e.entry_date));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Calendário
        </h1>
        <p className="text-sm text-muted">
          Acompanhe os dias em que você completou seu devocional.
        </p>
      </div>

      <Card className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
          <Flame size={24} />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {streak.current_streak} {streak.current_streak === 1 ? "dia" : "dias"} seguidos
          </p>
          <p className="text-sm text-muted">
            Recorde: {streak.longest_streak}{" "}
            {streak.longest_streak === 1 ? "dia" : "dias"}
          </p>
        </div>
      </Card>

      <Card>
        <MonthCalendar
          year={year}
          month={month}
          completedDates={completedDates}
          todayISO={todayISO()}
        />
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-success/20" /> Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-primary" /> Hoje
          </span>
        </div>
      </Card>
    </div>
  );
}
