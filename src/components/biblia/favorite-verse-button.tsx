"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { favoriteBibleVerseAction } from "@/lib/actions-bible";
import { cn } from "@/lib/utils";

export function FavoriteVerseButton({
  verseId,
  reference,
  text,
}: {
  verseId: number;
  reference: string;
  text: string;
}) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await favoriteBibleVerseAction(verseId, reference, text);
      setState(result.error ? "error" : "saved");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || state === "saved"}
      title={state === "error" ? "Erro ao favoritar" : "Favoritar versículo"}
      className={cn(
        "shrink-0 rounded-md p-1 text-muted hover:bg-accent-soft hover:text-primary",
        state === "saved" && "text-primary",
      )}
    >
      <Star size={15} fill={state === "saved" ? "currentColor" : "none"} />
    </button>
  );
}
