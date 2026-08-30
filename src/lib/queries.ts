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

export async function getCompletedDatesInMonth(
  userId: string,
  year: number,
  month: number, // 1-12
) {
  const supabase = await createClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate).padStart(2, "0")}`;

  const { data } = await supabase
    .from("user_devotional_entries")
    .select("entry_date, completed")
    .eq("user_id", userId)
    .gte("entry_date", start)
    .lte("entry_date", end)
    .eq("completed", true);

  return data ?? [];
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

export async function getFavorites(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
