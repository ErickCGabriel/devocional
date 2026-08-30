"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { stripe } from "@/lib/stripe";

export async function deleteAccountAction(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const service = createServiceClient();

  const { data: subscription } = await service
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscription?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } catch {
      // já cancelada ou inexistente no Stripe — não impede a exclusão da conta
    }
  }

  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) return { error: "Não foi possível excluir a conta. Tente novamente." };

  await supabase.auth.signOut();
  redirect("/");
}
