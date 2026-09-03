"use client";

import { useActionState } from "react";
import { updateUserPlanAction, type AdminActionResult } from "@/lib/actions-admin";

const PLAN_OPTIONS = [
  { value: "free", label: "Grátis" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
  { value: "vitalicio", label: "Vitalício" },
];

export function PlanForm({ userId, currentPlan }: { userId: string; currentPlan: string }) {
  const action = updateUserPlanAction.bind(null, userId);
  const [state, formAction, pending] = useActionState<AdminActionResult, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <select
        name="plan"
        defaultValue={currentPlan}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300"
      >
        {PLAN_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar plano"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
