"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { STICKERS } from "@/lib/stickers";

export interface DevotionalEntryFields {
  gratitude?: string;
  notes?: string;
  sticker_key?: string | null;
}

export interface DevotionalActionResult {
  success?: true;
  error?: string;
}

async function upsertEntry(
  devotionalId: string,
  entryDate: string,
  fields: DevotionalEntryFields & { completed?: boolean; completed_at?: string | null },
): Promise<DevotionalActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("user_devotional_entries").upsert(
    {
      user_id: user.id,
      devotional_id: devotionalId,
      entry_date: entryDate,
      ...fields,
    },
    { onConflict: "user_id,devotional_id" },
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function autosaveDevotionalEntry(
  devotionalId: string,
  entryDate: string,
  fields: DevotionalEntryFields,
): Promise<DevotionalActionResult> {
  return upsertEntry(devotionalId, entryDate, fields);
}

/** Autosave da resposta de uma pergunta individual (reflexão/aplicação/oração). */
export async function autosaveQuestionAnswer(
  entryId: string,
  questionId: string,
  answer: string,
): Promise<DevotionalActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("user_devotional_answers").upsert(
    { entry_id: entryId, question_id: questionId, answer },
    { onConflict: "entry_id,question_id" },
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function setEntrySticker(
  devotionalId: string,
  entryDate: string,
  stickerKey: string | null,
): Promise<DevotionalActionResult> {
  if (stickerKey !== null && !STICKERS.some((s) => s.key === stickerKey)) {
    return { error: "Figurinha inválida." };
  }

  const result = await upsertEntry(devotionalId, entryDate, {
    sticker_key: stickerKey,
  });

  if (result.success) {
    revalidatePath("/devocional");
    revalidatePath("/calendario");
  }

  return result;
}

export async function markDevotionalCompleted(
  devotionalId: string,
  entryDate: string,
  fields: DevotionalEntryFields,
): Promise<DevotionalActionResult> {
  const result = await upsertEntry(devotionalId, entryDate, {
    ...fields,
    completed: true,
    completed_at: new Date().toISOString(),
  });

  if (result.success) {
    revalidatePath("/painel");
    revalidatePath("/devocional");
    revalidatePath("/calendario");
    revalidatePath("/estatisticas");
  }

  return result;
}
