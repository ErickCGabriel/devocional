"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { FREE_FAVORITES_LIMIT } from "@/lib/limits";

export async function addFavoriteAction(
  _prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const verseReference = String(formData.get("verseReference") ?? "").trim();
  const verseText = String(formData.get("verseText") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!verseReference) return { error: "Informe a referência do versículo." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const subscription = await getSubscription();
  if (!subscription.isPremium) {
    const { count } = await supabase
      .from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= FREE_FAVORITES_LIMIT) {
      return {
        error: `Limite de ${FREE_FAVORITES_LIMIT} favoritos do plano gratuito atingido. Assine o Premium para favoritos ilimitados.`,
      };
    }
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    verse_reference: verseReference,
    verse_text: verseText || null,
    note: note || null,
    source: "manual",
  });

  if (error) return { error: error.message };
  revalidatePath("/favoritos");
  return {};
}

/** Favoritar rápido (sem formulário) — usado no botão de coração do devocional do dia. */
export async function quickFavoriteAction(
  verseReference: string,
  verseText: string,
  source: "devocional" | "biblia",
  sourceId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("source", source)
    .eq("source_id", sourceId)
    .maybeSingle();
  if (existing) return {};

  const subscription = await getSubscription();
  if (!subscription.isPremium) {
    const { count } = await supabase
      .from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= FREE_FAVORITES_LIMIT) {
      return {
        error: `Limite de ${FREE_FAVORITES_LIMIT} favoritos do plano gratuito atingido.`,
      };
    }
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    verse_reference: verseReference,
    verse_text: verseText,
    source,
    source_id: sourceId,
  });

  if (error) return { error: error.message };
  revalidatePath("/favoritos");
  return {};
}

export async function deleteFavoriteAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("favorites").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/favoritos");
}
