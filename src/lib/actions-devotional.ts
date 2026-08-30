"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface DevotionalEntryFields {
  reflection?: string;
  application?: string;
  prayer?: string;
  gratitude?: string;
  notes?: string;
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
