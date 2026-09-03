"use client";

import { Trash2 } from "lucide-react";
import { deleteFeaturedVerseAction } from "@/lib/actions-admin";

export function DeleteVerseButton({ id }: { id: string }) {
  return (
    <form
      action={deleteFeaturedVerseAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Excluir este versículo do pool?")) e.preventDefault();
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
