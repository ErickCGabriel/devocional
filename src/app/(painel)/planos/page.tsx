import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getCurrentUser, getReadingPlans, getUserPlanProgress } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PlanosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [plans, progressList, subscription] = await Promise.all([
    getReadingPlans(),
    getUserPlanProgress(user.id),
    getSubscription(),
  ]);

  const progressByPlan = new Map(progressList.map((p) => [p.plan_id, p]));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Planos de leitura
        </h1>
        <p className="text-sm text-muted">
          Escolha um plano e acompanhe seu progresso dia a dia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => {
          const locked = plan.is_premium && !subscription.isPremium;
          const progress = progressByPlan.get(plan.id);
          const percent = progress
            ? Math.round(
                (progress.completed_days.length / plan.total_days) * 100,
              )
            : 0;

          return (
            <Card key={plan.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {plan.title}
                </h3>
                {plan.is_premium && (
                  <Badge className="shrink-0">
                    {locked && <Lock size={11} className="mr-1" />}
                    Premium
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex-1 text-sm text-muted">
                {plan.description}
              </p>
              <p className="mt-2 text-xs text-muted">{plan.total_days} dias</p>

              {progress && !locked && (
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-accent-soft">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{percent}% concluído</p>
                </div>
              )}

              <Link href={locked ? "/assinatura" : `/planos/${plan.slug}`} className="mt-4">
                <Button variant={locked ? "outline" : "primary"} className="w-full">
                  {locked ? "Desbloquear com Premium" : progress ? "Continuar plano" : "Ver plano"}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
