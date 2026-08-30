import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getCurrentUser } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { Card, Badge } from "@/components/ui/card";
import { CheckoutButton, ManageBillingButton } from "./checkout-buttons";

const FREE_FEATURES = [
  "Devocional diário completo",
  "1 plano de leitura gratuito",
  "Oração por pessoas",
  "Até 20 notas e 20 favoritos",
];

const PREMIUM_FEATURES = [
  "Sem anúncios",
  "Todos os planos de leitura liberados",
  "Notas e favoritos ilimitados",
  "4 temas visuais exclusivos",
  "Histórico completo de sequência",
];

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { status } = await searchParams;
  const subscription = await getSubscription();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Assinatura
        </h1>
        <p className="text-sm text-muted">
          Seu plano atual:{" "}
          <Badge>
            {subscription.plan === "free" && "Gratuito"}
            {subscription.plan === "mensal" && "Premium mensal"}
            {subscription.plan === "anual" && "Premium anual"}
            {subscription.plan === "vitalicio" && "Premium vitalício"}
          </Badge>
        </p>
      </div>

      {status === "sucesso" && (
        <Card className="border-success/40 bg-success/10 text-success">
          Pagamento confirmado! Seu acesso premium foi liberado.
        </Card>
      )}
      {status === "cancelado" && (
        <Card className="border-warning/40 bg-warning/10 text-warning">
          Checkout cancelado. Você pode tentar novamente quando quiser.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <h2 className="font-serif text-lg font-semibold">Gratuito</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">R$ 0</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-primary/50 ring-1 ring-primary/30">
          <Badge className="mb-1">Popular</Badge>
          <h2 className="font-serif text-lg font-semibold">Premium mensal</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            R$ 19,90<span className="text-sm font-normal text-muted">/mês</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            {subscription.plan === "mensal" ? (
              <ManageBillingButton />
            ) : (
              <CheckoutButton plan="mensal">Assinar mensal</CheckoutButton>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-lg font-semibold">Premium vitalício</h2>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            R$ 249<span className="text-sm font-normal text-muted"> pagamento único</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" />
                {f}
              </li>
            ))}
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-success" />
              Pague uma vez, acesso para sempre
            </li>
          </ul>
          <div className="mt-5">
            {subscription.plan === "vitalicio" ? (
              <Badge>Você já é vitalício</Badge>
            ) : (
              <CheckoutButton plan="vitalicio">Comprar acesso vitalício</CheckoutButton>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
