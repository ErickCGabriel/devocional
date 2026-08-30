"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function startPlanAction(
  planId: string,
  planSlug: string,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("user_plan_progress").upsert(
    {
      user_id: user.id,
      plan_id: planId,
      current_day: 1,
      completed_days: [],
    },
    { onConflict: "user_id,plan_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("startPlanAction:", error.message);
    return;
  }
  revalidatePath(`/planos/${planSlug}`);
}

export async function toggleDayCompleteAction(
  planId: string,
  planSlug: string,
  dayNumber: number,
  totalDays: number,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: progress } = await supabase
    .from("user_plan_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_id", planId)
    .maybeSingle();

  const completedDays = new Set<number>(progress?.completed_days ?? []);
  if (completedDays.has(dayNumber)) {
    completedDays.delete(dayNumber);
  } else {
    completedDays.add(dayNumber);
  }

  const completedArray = Array.from(completedDays).sort((a, b) => a - b);
  const isPlanComplete = completedArray.length >= totalDays;
  const nextDay = Math.min(
    Math.max(...completedArray, 0) + 1,
    totalDays,
  );

  const { error } = await supabase.from("user_plan_progress").upsert(
    {
      user_id: user.id,
      plan_id: planId,
      current_day: nextDay,
      completed_days: completedArray,
      completed_at: isPlanComplete ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,plan_id" },
  );

  if (error) {
    console.error("toggleDayCompleteAction:", error.message);
    return;
  }
  revalidatePath(`/planos/${planSlug}`);
}
