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

export interface ReadingPlanFormFields {
  slug: string;
  title: string;
  description: string | null;
  total_days: number;
  is_premium: boolean;
  cover_image_url: string | null;
}

function readReadingPlanFields(formData: FormData): ReadingPlanFormFields {
  const description = String(formData.get("description") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: description || null,
    total_days: Number(formData.get("total_days") ?? 0),
    is_premium: formData.get("is_premium") === "on",
    cover_image_url: coverImageUrl || null,
  };
}

function validateReadingPlanFields(fields: ReadingPlanFormFields): string | null {
  if (!fields.slug) return "Informe o slug (identificador na URL).";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fields.slug)) {
    return "Slug inválido — use só letras minúsculas, números e hífen.";
  }
  if (!fields.title) return "Dê um título.";
  if (!Number.isInteger(fields.total_days) || fields.total_days <= 0) {
    return "Total de dias precisa ser um número inteiro maior que zero.";
  }
  return null;
}

export async function createReadingPlanAction(
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readReadingPlanFields(formData);
  const validationError = validateReadingPlanFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reading_plans")
    .insert(fields)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Já existe um plano com esse slug." };
    return { error: error.message };
  }

  revalidatePath("/admin/planos");
  redirect(`/admin/planos/${data.id}`);
}

export async function updateReadingPlanAction(
  id: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readReadingPlanFields(formData);
  const validationError = validateReadingPlanFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("reading_plans").update(fields).eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Já existe um plano com esse slug." };
    return { error: error.message };
  }

  revalidatePath("/admin/planos");
  revalidatePath(`/admin/planos/${id}`);
  redirect(`/admin/planos/${id}`);
}

export async function deleteReadingPlanAction(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("reading_plans").delete().eq("id", id);
  revalidatePath("/admin/planos");
}

export interface ReadingPlanDayFormFields {
  day_number: number;
  title: string;
  passage_reference: string;
  content: string | null;
}

function readReadingPlanDayFields(formData: FormData): ReadingPlanDayFormFields {
  const content = String(formData.get("content") ?? "").trim();
  return {
    day_number: Number(formData.get("day_number") ?? 0),
    title: String(formData.get("title") ?? "").trim(),
    passage_reference: String(formData.get("passage_reference") ?? "").trim(),
    content: content || null,
  };
}

function validateReadingPlanDayFields(fields: ReadingPlanDayFormFields): string | null {
  if (!Number.isInteger(fields.day_number) || fields.day_number <= 0) {
    return "O número do dia precisa ser um inteiro maior que zero.";
  }
  if (!fields.title) return "Dê um título pro dia.";
  if (!fields.passage_reference) return "Informe a referência da passagem.";
  return null;
}

export async function createReadingPlanDayAction(
  planId: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readReadingPlanDayFields(formData);
  const validationError = validateReadingPlanDayFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("reading_plan_days")
    .insert({ plan_id: planId, ...fields });

  if (error) {
    if (error.code === "23505") return { error: "Já existe um dia com esse número nesse plano." };
    return { error: error.message };
  }

  revalidatePath(`/admin/planos/${planId}`);
  redirect(`/admin/planos/${planId}`);
}

export async function updateReadingPlanDayAction(
  dayId: string,
  planId: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readReadingPlanDayFields(formData);
  const validationError = validateReadingPlanDayFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("reading_plan_days").update(fields).eq("id", dayId);

  if (error) {
    if (error.code === "23505") return { error: "Já existe um dia com esse número nesse plano." };
    return { error: error.message };
  }

  revalidatePath(`/admin/planos/${planId}`);
  redirect(`/admin/planos/${planId}`);
}

export async function deleteReadingPlanDayAction(dayId: string, planId: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("reading_plan_days").delete().eq("id", dayId);
  revalidatePath(`/admin/planos/${planId}`);
}

export interface FeaturedVerseFormFields {
  verse_reference: string;
  verse_text: string;
}

function readFeaturedVerseFields(formData: FormData): FeaturedVerseFormFields {
  return {
    verse_reference: String(formData.get("verse_reference") ?? "").trim(),
    verse_text: String(formData.get("verse_text") ?? "").trim(),
  };
}

function validateFeaturedVerseFields(fields: FeaturedVerseFormFields): string | null {
  if (!fields.verse_reference) return "Informe a referência do versículo.";
  if (!fields.verse_text) return "Escreva o texto do versículo.";
  return null;
}

export async function createFeaturedVerseAction(
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readFeaturedVerseFields(formData);
  const validationError = validateFeaturedVerseFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("featured_verses").insert(fields);
  if (error) return { error: error.message };

  revalidatePath("/admin/versiculos");
  redirect("/admin/versiculos");
}

export async function updateFeaturedVerseAction(
  id: string,
  _prevState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const fields = readFeaturedVerseFields(formData);
  const validationError = validateFeaturedVerseFields(fields);
  if (validationError) return { error: validationError };

  const supabase = createServiceClient();
  const { error } = await supabase.from("featured_verses").update(fields).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/versiculos");
  redirect("/admin/versiculos");
}

export async function deleteFeaturedVerseAction(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase.from("featured_verses").delete().eq("id", id);
  revalidatePath("/admin/versiculos");
}
