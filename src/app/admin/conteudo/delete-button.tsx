"use client";

import { Trash2 } from "lucide-react";
import { deleteDevotionalAction } from "@/lib/actions-admin";

export function DeleteDevotionalButton({ id }: { id: string }) {
  return (
    <form
      action={deleteDevotionalAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Excluir este devocional? As respostas dos usuários pra esse dia continuam salvas.")) {
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
