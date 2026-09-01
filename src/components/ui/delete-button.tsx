"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({ action }: { action: () => void | Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Excluir este item?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="shrink-0 rounded-md p-1.5 text-muted hover:bg-error-soft hover:text-error"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
