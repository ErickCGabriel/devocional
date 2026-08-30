"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { FREE_NOTES_LIMIT } from "@/lib/limits";

export async function addNoteAction(
  _prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "Escreva algo para salvar a nota." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const subscription = await getSubscription();
  if (!subscription.isPremium) {
    const { count } = await supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= FREE_NOTES_LIMIT) {
      return {
        error: `Limite de ${FREE_NOTES_LIMIT} notas do plano gratuito atingido. Assine o Premium para notas ilimitadas.`,
      };
    }
  }

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title: title || null,
    content,
  });

  if (error) return { error: error.message };
  revalidatePath("/notas");
  return {};
}

export async function deleteNoteAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/notas");
}
