import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const BRAZIL_TZ = "America/Sao_Paulo";

/**
 * "Agora" no horário de Brasília, como um Date cujos getters *UTC*
 * (getUTCFullYear, getUTCMonth, getUTCDate, getUTCDay, ...) refletem o
 * horário de Brasília — independente do fuso horário do servidor (o
 * servidor roda em UTC, e usar `new Date()` puro faz o dia virar cedo
 * demais: às 21h em Brasília já é meia-noite em UTC).
 */
export function nowInBrazil(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BRAZIL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return new Date(
    Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second")),
  );
}

export function todayISO(): string {
  return formatDateISO(nowInBrazil());
}
