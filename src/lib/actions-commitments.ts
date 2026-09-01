"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CommitmentActionResult {
  error?: string;
}

export async function addCommitmentAction(
  _prevState: CommitmentActionResult,
  formData: FormData,
): Promise<CommitmentActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const weekdays = formData
    .getAll("weekdays")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  const timeOfDay = String(formData.get("timeOfDay") ?? "").trim();

  if (!title) return { error: "Dê um nome para o compromisso." };
  if (weekdays.length === 0) {
    return { error: "Selecione pelo menos um dia da semana." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const { error } = await supabase.from("user_commitments").insert({
    user_id: user.id,
    title,
    weekdays,
    time_of_day: timeOfDay || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/calendario");
  revalidatePath("/painel");
  return {};
}

export async function deleteCommitmentAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_commitments").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/calendario");
  revalidatePath("/painel");
}
