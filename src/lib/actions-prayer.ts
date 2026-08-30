"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addPrayerRequestAction(formData: FormData) {
  const personName = String(formData.get("personName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!personName) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("prayer_requests").insert({
    user_id: user.id,
    person_name: personName,
    description: description || null,
  });

  revalidatePath("/oracao");
}

export async function togglePrayerStatusAction(
  id: string,
  currentStatus: "ativo" | "respondido",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const nextStatus = currentStatus === "ativo" ? "respondido" : "ativo";

  await supabase
    .from("prayer_requests")
    .update({
      status: nextStatus,
      answered_at: nextStatus === "respondido" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/oracao");
}

export async function deletePrayerRequestAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("prayer_requests").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/oracao");
}
