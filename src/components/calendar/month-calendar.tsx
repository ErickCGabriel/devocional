import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayStatus } from "@/lib/queries";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function MonthCalendar({
  year,
  month, // 1-12
  dayStatus,
  todayISO,
  basePath = "/calendario",
}: {
  year: number;
  month: number;
  dayStatus: Map<string, DayStatus>;
  todayISO: string;
  basePath?: string;
}) {
  const firstDay = new Date(year, month - 1, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <div className="flex items-center gap-1">
          <Link
            href={`${basePath}?year=${prevYear}&month=${prevMonth}`}
            className="rounded-md p-1 text-muted hover:bg-accent-soft"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </Link>
          <Link
            href={`${basePath}?year=${nextYear}&month=${nextMonth}`}
            className="rounded-md p-1 text-muted hover:bg-accent-soft"
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {WEEKDAYS.map((day, i) => (
          <div key={i} className="py-1 font-medium">
            {day}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = iso === todayISO;
          const isFuture = iso > todayISO;
          const status = dayStatus.get(iso);

          const dayCell = (
            <span
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm",
                isToday && "bg-primary font-semibold text-primary-foreground",
                !isToday && status === "completo" && "bg-success/20 font-medium text-success",
                !isToday && status === "parcial" && "bg-warning/20 font-medium text-warning",
                !isToday && !status && "text-foreground/70",
              )}
            >
              {day}
            </span>
          );

          if (isFuture) {
            return <div key={iso}>{dayCell}</div>;
          }

          return (
            <Link key={iso} href={isToday ? "/devocional" : `/devocional/${iso}`}>
              {dayCell}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
