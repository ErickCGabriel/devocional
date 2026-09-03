"use client";

import { Trash2 } from "lucide-react";
import { deleteReadingPlanDayAction } from "@/lib/actions-admin";

export function DeleteDayButton({ dayId, planId }: { dayId: string; planId: string }) {
  return (
    <form
      action={deleteReadingPlanDayAction.bind(null, dayId, planId)}
      onSubmit={(e) => {
        if (!confirm("Excluir este dia do plano?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
        title="Excluir"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
