import { redirect } from "next/navigation";
import { Flame, BookOpenCheck, StickyNote, Star, HeartHandshake, Lock } from "lucide-react";
import { getCurrentUser, getStreak, getStats } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EstatisticasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [streak, stats, subscription] = await Promise.all([
    getStreak(user.id),
    getStats(user.id),
    getSubscription(),
  ]);

  const cards = [
    { label: "Sequência atual", value: streak.current_streak, icon: Flame, suffix: "dias" },
    { label: "Recorde de sequência", value: streak.longest_streak, icon: Flame, suffix: "dias" },
    { label: "Devocionais concluídos", value: stats.completedDevotionals, icon: BookOpenCheck, suffix: "" },
    { label: "Notas salvas", value: stats.notes, icon: StickyNote, suffix: "" },
    { label: "Versículos favoritados", value: stats.favorites, icon: Star, suffix: "" },
    { label: "Orações respondidas", value: stats.answeredPrayers, icon: HeartHandshake, suffix: "" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Estatísticas
        </h1>
        <p className="text-sm text-muted">Sua jornada com Deus em números.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-primary">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground">
                  {card.value} {card.suffix}
                </p>
                <p className="text-sm text-muted">{card.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {!subscription.isPremium && (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <Lock size={24} className="text-primary" />
          <h2 className="font-serif text-lg font-semibold">
            Histórico completo é premium
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Assinantes premium têm acesso a gráficos de evolução mensal e
            histórico completo de sequência.
          </p>
          <Link href="/assinatura">
            <Button>Assinar Premium</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
