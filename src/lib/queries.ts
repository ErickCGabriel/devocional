import "server-only";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getTodayDevotional() {
  const supabase = await createClient();
  const today = todayISO();

  const { data: exact } = await supabase
    .from("devotionals")
    .select("*")
    .eq("devotional_date", today)
    .maybeSingle();

  if (exact) return { devotional: exact, isToday: true };

  const { data: fallback } = await supabase
    .from("devotionals")
    .select("*")
    .lte("devotional_date", today)
    .order("devotional_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { devotional: fallback, isToday: false };
}

export async function getEntryForDevotional(devotionalId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_devotional_entries")
    .select("*")
    .eq("devotional_id", devotionalId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

/**
 * Retorna a entrada do dia, criando-a se ainda não existir. A criação
 * dispara o trigger que sorteia as perguntas de reflexão/aplicação/oração
 * daquele dia (ver migration 0004_question_bank.sql).
 */
export async function getOrCreateEntry(
  devotionalId: string,
  userId: string,
  entryDate: string,
) {
  const existing = await getEntryForDevotional(devotionalId, userId);
  if (existing) return existing;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_devotional_entries")
    .insert({ user_id: userId, devotional_id: devotionalId, entry_date: entryDate })
    .select("*")
    .single();

  if (error) {
    // condição de corrida rara (dois inserts simultâneos) — a linha já existe
    const retry = await getEntryForDevotional(devotionalId, userId);
    if (retry) return retry;
    throw error;
  }

  return data;
}

export interface DevotionalQuestionWithAnswer {
  id: string;
  question: string;
  answer: string;
}

async function getQuestionsWithAnswers(
  questionIds: string[],
  answersByQuestionId: Map<string, string>,
): Promise<DevotionalQuestionWithAnswer[]> {
  if (questionIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("devotional_questions")
    .select("id, question")
    .in("id", questionIds);

  const byId = new Map((data ?? []).map((q) => [q.id, q.question]));

  return questionIds
    .filter((id) => byId.has(id))
    .map((id) => ({
      id,
      question: byId.get(id)!,
      answer: answersByQuestionId.get(id) ?? "",
    }));
}

export async function getEntryQuestionsWithAnswers(entry: {
  id: string;
  reflection_question_ids: string[];
  application_question_ids: string[];
  prayer_question_ids: string[];
}) {
  const supabase = await createClient();
  const { data: answers } = await supabase
    .from("user_devotional_answers")
    .select("question_id, answer")
    .eq("entry_id", entry.id);

  const answersByQuestionId = new Map(
    (answers ?? []).map((a) => [a.question_id, a.answer ?? ""]),
  );

  const [reflection, application, prayer] = await Promise.all([
    getQuestionsWithAnswers(entry.reflection_question_ids, answersByQuestionId),
    getQuestionsWithAnswers(entry.application_question_ids, answersByQuestionId),
    getQuestionsWithAnswers(entry.prayer_question_ids, answersByQuestionId),
  ]);

  return { reflection, application, prayer };
}

export async function getEntryByDate(userId: string, entryDate: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_devotional_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .maybeSingle();
  return data;
}

export async function getDevotionalById(devotionalId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("devotionals")
    .select("*")
    .eq("id", devotionalId)
    .maybeSingle();
  return data;
}

export async function getStreak(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (
    data ?? {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
      updated_at: new Date().toISOString(),
    }
  );
}

export async function getWeeklyVerse() {
  const supabase = await createClient();
  const today = todayISO();
  const { data } = await supabase
    .from("weekly_verses")
    .select("*")
    .lte("week_start", today)
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export type DayStatus = "completo" | "parcial";

/** Mapa data (YYYY-MM-DD) → status do devocional naquele dia, para o mês inteiro. */
export async function getMonthDayStatus(
  userId: string,
  year: number,
  month: number, // 1-12
): Promise<Map<string, DayStatus>> {
  const supabase = await createClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate).padStart(2, "0")}`;

  const { data } = await supabase
    .from("user_devotional_entries")
    .select("entry_date, completed")
    .eq("user_id", userId)
    .gte("entry_date", start)
    .lte("entry_date", end);

  const map = new Map<string, DayStatus>();
  for (const row of data ?? []) {
    map.set(row.entry_date, row.completed ? "completo" : "parcial");
  }
  return map;
}

export async function getReadingPlans() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_plans")
    .select("*")
    .order("total_days", { ascending: true });
  return data ?? [];
}

export interface PlanProgressWithPlan {
  id: string;
  user_id: string;
  plan_id: string;
  current_day: number;
  completed_days: number[];
  started_at: string;
  completed_at: string | null;
  updated_at: string;
  reading_plan: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    total_days: number;
    is_premium: boolean;
  } | null;
}

export async function getUserPlanProgress(
  userId: string,
): Promise<PlanProgressWithPlan[]> {
  const supabase = await createClient();
  const { data: progress } = await supabase
    .from("user_plan_progress")
    .select("*")
    .eq("user_id", userId);

  if (!progress || progress.length === 0) return [];

  const { data: plans } = await supabase
    .from("reading_plans")
    .select("*")
    .in("id", progress.map((p) => p.plan_id));

  const plansById = new Map((plans ?? []).map((p) => [p.id, p]));

  return progress.map((p) => ({
    ...p,
    reading_plan: plansById.get(p.plan_id) ?? null,
  }));
}

export async function getPlanBySlug(slug: string) {
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("reading_plans")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!plan) return null;

  const { data: days } = await supabase
    .from("reading_plan_days")
    .select("*")
    .eq("plan_id", plan.id)
    .order("day_number", { ascending: true });

  return { plan, days: days ?? [] };
}

export async function getPlanProgress(userId: string, planId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_plan_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_id", planId)
    .maybeSingle();
  return data;
}

export async function getPrayerRequests(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getNotes(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getBibleBooks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bible_books")
    .select("*")
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getBibleBook(abbrev: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bible_books")
    .select("*")
    .eq("abbrev", abbrev)
    .maybeSingle();
  return data;
}

export async function getBibleChapter(bookId: number, chapter: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bible_verses")
    .select("*")
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .order("verse", { ascending: true });
  return data ?? [];
}

export interface BibleSearchResult {
  id: number;
  chapter: number;
  verse: number;
  text: string;
  book: { abbrev: string; name: string } | null;
}

export async function searchBibleVerses(
  query: string,
  limit = 40,
): Promise<BibleSearchResult[]> {
  const supabase = await createClient();
  const { data: verses } = await supabase
    .from("bible_verses")
    .select("id, book_id, chapter, verse, text")
    .textSearch("text", query, { type: "websearch", config: "portuguese" })
    .limit(limit);

  if (!verses || verses.length === 0) return [];

  const { data: books } = await supabase
    .from("bible_books")
    .select("id, abbrev, name")
    .in("id", [...new Set(verses.map((v) => v.book_id))]);

  const booksById = new Map((books ?? []).map((b) => [b.id, b]));

  return verses.map((v) => ({
    id: v.id,
    chapter: v.chapter,
    verse: v.verse,
    text: v.text,
    book: booksById.get(v.book_id) ?? null,
  }));
}

export async function getStats(userId: string) {
  const supabase = await createClient();

  const [{ count: completedCount }, { count: notesCount }, { count: favoritesCount }, { count: answeredPrayers }] =
    await Promise.all([
      supabase
        .from("user_devotional_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true),
      supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("favorites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("prayer_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "respondido"),
    ]);

  return {
    completedDevotionals: completedCount ?? 0,
    notes: notesCount ?? 0,
    favorites: favoritesCount ?? 0,
    answeredPrayers: answeredPrayers ?? 0,
  };
}

export async function isFavorited(
  userId: string,
  source: "devocional" | "biblia",
  sourceId: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("source", source)
    .eq("source_id", sourceId)
    .maybeSingle();
  return !!data;
}

export async function getFavoritedSourceIds(
  userId: string,
  source: "devocional" | "biblia",
  sourceIds: string[],
): Promise<Set<string>> {
  if (sourceIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("source_id")
    .eq("user_id", userId)
    .eq("source", source)
    .in("source_id", sourceIds);
  return new Set((data ?? []).map((f) => f.source_id).filter((id): id is string => !!id));
}

export async function getFavorites(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
