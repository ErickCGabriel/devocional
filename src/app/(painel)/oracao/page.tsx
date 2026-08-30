import { redirect } from "next/navigation";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { getCurrentUser, getPrayerRequests } from "@/lib/queries";
import {
  addPrayerRequestAction,
  togglePrayerStatusAction,
  deletePrayerRequestAction,
} from "@/lib/actions-prayer";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function OracaoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await getPrayerRequests(user.id);
  const active = requests.filter((r) => r.status === "ativo");
  const answered = requests.filter((r) => r.status === "respondido");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Oração por pessoas
        </h1>
        <p className="text-sm text-muted">
          {active.length} {active.length === 1 ? "pedido ativo" : "pedidos ativos"} ·{" "}
          {answered.length} {answered.length === 1 ? "respondido" : "respondidos"}
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Novo pedido de oração
        </h2>
        <form action={addPrayerRequestAction} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="personName">Nome da pessoa</Label>
            <Input id="personName" name="personName" required placeholder="Ex: Maria" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Pedido (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Descreva o pedido de oração..."
            />
          </div>
          <Button type="submit">Adicionar pedido</Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Ativos</h2>
        {active.length === 0 && (
          <p className="text-sm text-muted">Nenhum pedido ativo no momento.</p>
        )}
        {active.map((request) => (
          <PrayerCard key={request.id} request={request} />
        ))}
      </div>

      {answered.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Respondidos</h2>
          {answered.map((request) => (
            <PrayerCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

function PrayerCard({
  request,
}: {
  request: {
    id: string;
    person_name: string;
    description: string | null;
    status: "ativo" | "respondido";
  };
}) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{request.person_name}</p>
          <Badge className={request.status === "respondido" ? "bg-success/15 text-success" : ""}>
            {request.status === "respondido" ? "Respondido" : "Ativo"}
          </Badge>
        </div>
        {request.description && (
          <p className="mt-1 text-sm text-muted">{request.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <form action={togglePrayerStatusAction.bind(null, request.id, request.status)}>
          <button
            type="submit"
            className="rounded-md p-1.5 text-muted hover:bg-accent-soft hover:text-primary"
            title={request.status === "ativo" ? "Marcar como respondido" : "Reabrir pedido"}
          >
            {request.status === "ativo" ? <Check size={16} /> : <RotateCcw size={16} />}
          </button>
        </form>
        <form action={deletePrayerRequestAction.bind(null, request.id)}>
          <button
            type="submit"
            className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </Card>
  );
}
