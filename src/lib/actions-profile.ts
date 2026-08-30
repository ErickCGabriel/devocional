"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import type { Theme } from "@/lib/types/database";

export async function updateProfileNameAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  revalidatePath("/configuracoes");
  revalidatePath("/painel");
}

export async function updateThemeAction(theme: Theme) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (theme !== "padrao") {
    const subscription = await getSubscription();
    if (!subscription.isPremium) return;
  }

  await supabase.from("profiles").update({ theme }).eq("id", user.id);
  revalidatePath("/", "layout");
}
