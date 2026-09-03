import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Garante que quem está acessando é um admin autenticado. Usa o client
 * normal (respeitando RLS) só para checar a própria sessão — as consultas
 * privilegiadas em si (ler/editar dados de outros usuários) usam o
 * service_role client (src/lib/supabase/service.ts) dentro das próprias
 * queries/actions de admin, nunca aqui.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/painel");

  return { user, fullName: profile.full_name };
}
