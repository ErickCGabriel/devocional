import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminReadingPlanById, getAdminReadingPlanDayById } from "@/lib/queries-admin";
import { updateReadingPlanDayAction } from "@/lib/actions-admin";
import { DayForm } from "../day-form";

export default async function EditReadingPlanDayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id, dayId } = await params;
  const [plan, day] = await Promise.all([
    getAdminReadingPlanById(id),
    getAdminReadingPlanDayById(dayId),
  ]);
  if (!plan || !day) notFound();

  const action = updateReadingPlanDayAction.bind(null, dayId, id);

  return (
    <div className="space-y-4">
      <Link
        href={`/admin/planos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> {plan.title}
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Editar dia {day.day_number}</h1>
      <DayForm
        action={action}
        submitLabel="Salvar alterações"
        initialValues={{
          day_number: day.day_number,
          title: day.title,
          passage_reference: day.passage_reference,
          content: day.content,
        }}
      />
    </div>
  );
}
