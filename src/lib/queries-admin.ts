import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  theme: string;
  plan: string;
  status: string;
  current_period_end: string | null;
}

/**
 * Lista usuários combinando auth.users (e-mail) com profiles e subscriptions.
 * auth.users só é legível pelo service_role, por isso a junção é feita aqui
 * em memória em vez de uma view/SQL direta.
 */
export async function getAdminUsers(search?: string): Promise<AdminUserRow[]> {
  const supabase = createServiceClient();

  const [{ data: authUsers }, { data: profiles }, { data: subscriptions }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from("profiles").select("id, full_name, theme, created_at"),
      supabase.from("subscriptions").select("user_id, plan, status, current_period_end"),
    ]);

  const profilesById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const subsById = new Map((subscriptions ?? []).map((s) => [s.user_id, s]));

  const rows: AdminUserRow[] = (authUsers?.users ?? []).map((u) => {
    const profile = profilesById.get(u.id);
    const sub = subsById.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "(sem e-mail)",
      full_name: profile?.full_name ?? null,
      created_at: profile?.created_at ?? u.created_at,
      theme: profile?.theme ?? "feminino",
      plan: sub?.plan ?? "free",
      status: sub?.status ?? "active",
      current_period_end: sub?.current_period_end ?? null,
    };
  });

  rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  if (!search) return rows;
  const q = search.trim().toLowerCase();
  return rows.filter(
    (r) => r.email.toLowerCase().includes(q) || (r.full_name ?? "").toLowerCase().includes(q),
  );
}

export async function getAdminUserDetail(userId: string) {
  const supabase = createServiceClient();

  const [{ data: authUser }, { data: profile }, { data: subscription }, { data: entries }] =
    await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("user_devotional_entries")
        .select("entry_date, completed")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false })
        .limit(10),
    ]);

  if (!authUser?.user) return null;

  return {
    email: authUser.user.email ?? "(sem e-mail)",
    createdAt: authUser.user.created_at,
    profile,
    subscription,
    recentEntries: entries ?? [],
  };
}

export interface AdminDashboardStats {
  totalUsers: number;
  premiumUsers: number;
  entriesToday: number;
  devotionalsCount: number;
}

export async function getAdminStats(): Promise<AdminDashboardStats> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: authUsers }, { count: premiumUsers }, { count: entriesToday }, { count: devotionalsCount }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase
        .from("subscriptions")
        .select("user_id", { count: "exact", head: true })
        .in("plan", ["mensal", "anual", "vitalicio"]),
      supabase
        .from("user_devotional_entries")
        .select("id", { count: "exact", head: true })
        .eq("entry_date", today),
      supabase.from("devotionals").select("id", { count: "exact", head: true }),
    ]);

  return {
    totalUsers: authUsers?.users.length ?? 0,
    premiumUsers: premiumUsers ?? 0,
    entriesToday: entriesToday ?? 0,
    devotionalsCount: devotionalsCount ?? 0,
  };
}

export async function getAdminDevotionals() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("devotionals")
    .select("*")
    .order("devotional_date", { ascending: false });
  return data ?? [];
}

export async function getAdminDevotionalById(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase.from("devotionals").select("*").eq("id", id).maybeSingle();
  return data;
}

export interface AdminReadingPlanRow {
  id: string;
  slug: string;
  title: string;
  total_days: number;
  is_premium: boolean;
  daysRegistered: number;
}

export async function getAdminReadingPlans(): Promise<AdminReadingPlanRow[]> {
  const supabase = createServiceClient();
  const [{ data: plans }, { data: days }] = await Promise.all([
    supabase.from("reading_plans").select("*").order("created_at", { ascending: false }),
    supabase.from("reading_plan_days").select("plan_id"),
  ]);

  const countByPlan = new Map<string, number>();
  for (const d of days ?? []) {
    countByPlan.set(d.plan_id, (countByPlan.get(d.plan_id) ?? 0) + 1);
  }

  return (plans ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    total_days: p.total_days,
    is_premium: p.is_premium,
    daysRegistered: countByPlan.get(p.id) ?? 0,
  }));
}

export async function getAdminReadingPlanById(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase.from("reading_plans").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminReadingPlanDays(planId: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("reading_plan_days")
    .select("*")
    .eq("plan_id", planId)
    .order("day_number", { ascending: true });
  return data ?? [];
}

export async function getAdminReadingPlanDayById(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase.from("reading_plan_days").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminFeaturedVerses() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("featured_verses")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getAdminFeaturedVerseById(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase.from("featured_verses").select("*").eq("id", id).maybeSingle();
  return data;
}
