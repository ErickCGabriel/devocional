import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionPlan, SubscriptionStatus } from "@/lib/types/database";

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isPremium: boolean;
  currentPeriodEnd: string | null;
}

const PREMIUM_PLANS: SubscriptionPlan[] = ["mensal", "anual", "vitalicio"];

export async function getSubscription(): Promise<SubscriptionInfo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { plan: "free", status: "active", isPremium: false, currentPeriodEnd: null };
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    return { plan: "free", status: "active", isPremium: false, currentPeriodEnd: null };
  }

  const isPremium =
    PREMIUM_PLANS.includes(data.plan) &&
    (data.status === "active" || data.plan === "vitalicio");

  return {
    plan: data.plan,
    status: data.status,
    isPremium,
    currentPeriodEnd: data.current_period_end,
  };
}
