import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { updateProfileNameAction } from "@/lib/actions-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ThemeSwitcher } from "./theme-switcher";
import { ManageBillingButton } from "../assinatura/checkout-buttons";
import Link from "next/link";

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
        <h2 className="mb-3 text-sm font-semibold text-foreground">Perfil</h2>
        <form action={updateProfileNameAction} className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="fullName">Nome</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.full_name ?? ""}
            />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Tema visual</h2>
        <ThemeSwitcher
          current={profile?.theme ?? "padrao"}
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
    </div>
  );
}
