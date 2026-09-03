"use client";

import { Trash2 } from "lucide-react";
import { deleteReadingPlanAction } from "@/lib/actions-admin";

export function DeletePlanButton({ id }: { id: string }) {
  return (
    <form
      action={deleteReadingPlanAction.bind(null, id)}
      onSubmit={(e) => {
        if (
          !confirm(
            "Excluir este plano? Todos os dias cadastrados e o progresso dos usuários nesse plano serão apagados também.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
