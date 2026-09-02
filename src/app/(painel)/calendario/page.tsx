import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getMonthDayStatus,
  getStreak,
  getCommitments,
  getMonthNoteDates,
} from "@/lib/queries";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { CommitmentsManager } from "./commitments-manager";
import { Card } from "@/components/ui/card";
import { todayISO, nowInBrazil } from "@/lib/utils";
import { Flame } from "lucide-react";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const now = nowInBrazil();
  const year = Number(params.year) || now.getUTCFullYear();
  const month = Number(params.month) || now.getUTCMonth() + 1;

  const [dayStatus, streak, commitments, noteDates] = await Promise.all([
    getMonthDayStatus(user.id, year, month),
    getStreak(user.id),
    getCommitments(user.id),
    getMonthNoteDates(user.id, year, month),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Calendário
        </h1>
        <p className="text-sm text-muted">
          Acompanhe os dias em que você completou seu devocional. Clique em
          um dia para ver o que foi escrito nele.
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
          dayStatus={dayStatus}
          todayISO={todayISO()}
          commitments={commitments}
          noteDates={noteDates}
        />
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-success/20" /> Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-warning/20" /> Parcial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-primary" /> Hoje
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Compromisso
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Nota com data
          </span>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Compromissos recorrentes
        </h2>
        <p className="mb-4 text-xs text-muted">
          Cadastre missas, cultos ou encontros que se repetem toda semana —
          eles aparecem marcados no calendário acima.
        </p>
        <CommitmentsManager commitments={commitments} />
      </Card>
    </div>
  );
}
