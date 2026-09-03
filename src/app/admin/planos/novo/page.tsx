import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createReadingPlanAction } from "@/lib/actions-admin";
import { PlanForm } from "../plan-form";

export default function NewReadingPlanPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/planos"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Planos de leitura
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Novo plano</h1>
      <PlanForm action={createReadingPlanAction} submitLabel="Criar plano" />
    </div>
  );
}
