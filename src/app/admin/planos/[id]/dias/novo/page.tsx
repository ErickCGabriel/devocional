import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminReadingPlanById, getAdminReadingPlanDays } from "@/lib/queries-admin";
import { createReadingPlanDayAction } from "@/lib/actions-admin";
import { DayForm } from "../day-form";

export default async function NewReadingPlanDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, days] = await Promise.all([
    getAdminReadingPlanById(id),
    getAdminReadingPlanDays(id),
  ]);
  if (!plan) notFound();

  const nextDayNumber = days.reduce((max, d) => Math.max(max, d.day_number), 0) + 1;
  const action = createReadingPlanDayAction.bind(null, id);

  return (
    <div className="space-y-4">
      <Link
        href={`/admin/planos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> {plan.title}
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Novo dia</h1>
      <DayForm
        action={action}
        submitLabel="Adicionar dia"
        initialValues={{
          day_number: nextDayNumber,
          title: "",
          passage_reference: "",
          content: null,
        }}
      />
    </div>
  );
}
