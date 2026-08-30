import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Check, Lock, ArrowLeft } from "lucide-react";
import { getCurrentUser, getPlanBySlug, getPlanProgress } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { startPlanAction, toggleDayCompleteAction } from "@/lib/actions-plans";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PlanoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const result = await getPlanBySlug(slug);
  if (!result) notFound();
  const { plan, days } = result;

  const subscription = await getSubscription();
  const locked = plan.is_premium && !subscription.isPremium;
  const progress = locked ? null : await getPlanProgress(user.id, plan.id);
  const completedDays = new Set(progress?.completed_days ?? []);
  const percent = progress
    ? Math.round((progress.completed_days.length / plan.total_days) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/planos"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {plan.title}
          </h1>
          {plan.is_premium && <Badge>Premium</Badge>}
        </div>
        <p className="mt-1 text-sm text-muted">{plan.description}</p>
      </div>

      {locked ? (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <Lock size={28} className="text-primary" />
          <h2 className="font-serif text-lg font-semibold">
            Plano exclusivo para assinantes Premium
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Assine o Meu Devocional Premium para desbloquear este e todos os
            outros planos de leitura.
          </p>
          <Link href="/assinatura">
            <Button>Ver planos de assinatura</Button>
          </Link>
        </Card>
      ) : (
        <>
          {!progress ? (
            <form action={startPlanAction.bind(null, plan.id, plan.slug)}>
              <Button type="submit">Começar plano</Button>
            </form>
          ) : (
            <Card>
              <div className="h-2 w-full overflow-hidden rounded-full bg-accent-soft">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {progress.completed_days.length} de {plan.total_days} dias · {percent}%
              </p>
            </Card>
          )}

          <div className="space-y-2">
            {days.map((day) => {
              const done = completedDays.has(day.day_number);
              return (
                <form
                  key={day.id}
                  action={toggleDayCompleteAction.bind(
                    null,
                    plan.id,
                    plan.slug,
                    day.day_number,
                    plan.total_days,
                  )}
                >
                  <button
                    type="submit"
                    disabled={!progress}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left transition-colors disabled:opacity-60",
                      done && "border-success/40 bg-success/10",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        done
                          ? "border-success bg-success text-white"
                          : "border-border text-muted",
                      )}
                    >
                      {done ? <Check size={14} /> : day.day_number}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        Dia {day.day_number} · {day.title}
                      </span>
                      <span className="block text-xs text-muted">
                        {day.passage_reference}
                      </span>
                    </span>
                  </button>
                </form>
              );
            })}
            {days.length === 0 && (
              <p className="text-sm text-muted">
                O conteúdo diário deste plano ainda será publicado.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
