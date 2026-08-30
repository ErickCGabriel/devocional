import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { DeleteAccountSection } from "./delete-account-section";
import { ManageBillingButton } from "../assinatura/checkout-buttons";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, subscription] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    getSubscription(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Configurações
        </h1>
        <p className="text-sm text-muted">{user.email}</p>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Tema visual</h2>
        <ThemeSwitcher
          current={profile?.theme ?? "feminino"}
          isPremium={subscription.isPremium}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Assinatura</h2>
        <p className="mb-3 text-sm text-muted">
          Plano atual:{" "}
          <span className="font-medium text-foreground">
            {subscription.plan === "free" ? "Gratuito" : "Premium"}
          </span>
        </p>
        {subscription.plan === "free" ? (
          <Link href="/assinatura">
            <Button>Ver planos premium</Button>
          </Link>
        ) : (
          <ManageBillingButton />
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Zona de perigo</h2>
        <DeleteAccountSection />
      </Card>
    </div>
  );
}
