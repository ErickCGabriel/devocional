"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";
import type { SubscriptionPlan } from "@/lib/types/database";

export interface AdminActionResult {
  error?: string;
}

const PLAN_VALUES: SubscriptionPlan[] = ["free", "mensal", "anual", "vitalicio"];

export async function updateUserPlanAction(
  userId: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const plan = String(formData.get("plan") ?? "");
  if (!PLAN_VALUES.includes(plan as SubscriptionPlan)) {
    return { error: "Plano inválido." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: plan as SubscriptionPlan,
      status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { error: error.message };
  revalidatePath(`/admin/usuarios/${userId}`);
  revalidatePath("/admin/usuarios");
  return {};
}

export interface DevotionalFormFields {
  devotional_date: string;
  title: string;
  verse_reference: string;
  verse_text: string;
  reading: string;
}

function readDevotionalFields(formData: FormData): DevotionalFormFields {
  return {
    devotional_date: String(formData.get("devotional_date") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    verse_reference: String(formData.get("verse_reference") ?? "").trim(),
    verse_text: String(formData.get("verse_text") ?? "").trim(),
    reading: String(formData.get("reading") ?? "").trim(),
  };
}

function validateDevotionalFields(fields: DevotionalFormFields): string | null {
  if (!fields.devotional_date) return "Escolha a data.";
  if (!fields.title) return "Dê um título.";
  if (!fields.verse_reference) return "Informe a referência do versículo.";
  if (!fields.verse_text) return "Escreva o texto do versículo.";
  if (!fields.reading) return "Escreva a instrução de leitura.";
  return null;
}

export async function createDevotionalAction(
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readDevotionalFields(formData);
  const validationError = validateDevotionalFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("devotionals").insert(fields);

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um devocional cadastrado para essa data." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/conteudo");
  redirect("/admin/conteudo");
}

export async function updateDevotionalAction(
  id: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readDevotionalFields(formData);
  const validationError = validateDevotionalFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("devotionals").update(fields).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um devocional cadastrado para essa data." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/conteudo");
  redirect("/admin/conteudo");
}

export async function deleteDevotionalAction(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("devotionals").delete().eq("id", id);
  revalidatePath("/admin/conteudo");
}
