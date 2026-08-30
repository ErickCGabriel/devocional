"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { FREE_FAVORITES_LIMIT } from "@/lib/limits";

export async function favoriteBibleVerseAction(
  verseId: number,
  reference: string,
  text: string,
): Promise<{ error?: string }> {
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
        error: `Limite de ${FREE_FAVORITES_LIMIT} favoritos do plano gratuito atingido.`,
      };
    }
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    verse_reference: reference,
    verse_text: text,
    source: "biblia",
    source_id: String(verseId),
  });

  if (error) return { error: error.message };
  revalidatePath("/favoritos");
  return {};
}
