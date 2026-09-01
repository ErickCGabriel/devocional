"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { GENERO_OPTIONS, RELIGIAO_OPTIONS, OBJETIVO_OPTIONS } from "@/lib/profile-options";
import type { Genero, Objetivo, Religiao, Theme } from "@/lib/types/database";

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

export async function updateProfileDetailsAction(formData: FormData) {
  const idade = Number(formData.get("idade") ?? "");
  const genero = String(formData.get("genero") ?? "");
  const religiao = String(formData.get("religiao") ?? "");
  const objetivo = String(formData.get("objetivo") ?? "");

  if (!Number.isInteger(idade) || idade < 1 || idade > 120) return;
  if (!GENERO_OPTIONS.some((o) => o.value === genero)) return;
  if (!RELIGIAO_OPTIONS.some((o) => o.value === religiao)) return;
  if (!OBJETIVO_OPTIONS.some((o) => o.value === objetivo)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      idade,
      genero: genero as Genero,
      religiao: religiao as Religiao,
      objetivo: objetivo as Objetivo,
    })
    .eq("id", user.id);
  revalidatePath("/perfil");
}

export async function updateThemeAction(theme: Theme) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const isFree = theme === "feminino" || theme === "masculino";
  if (!isFree) {
    const subscription = await getSubscription();
    if (!subscription.isPremium) return;
  }

  await supabase.from("profiles").update({ theme }).eq("id", user.id);
  revalidatePath("/", "layout");
}
