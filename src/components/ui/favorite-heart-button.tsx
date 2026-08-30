"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions-favorites";
import { cn } from "@/lib/utils";

export function FavoriteHeartButton({
  reference,
  text,
  source,
  sourceId,
  initialFavorited = false,
  className,
}: {
  reference: string;
  text: string;
  source: "devocional" | "biblia";
  sourceId: string;
  initialFavorited?: boolean;
  className?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (isPending) return;
    startTransition(async () => {
      const result = await toggleFavoriteAction(reference, text, source, sourceId);
      if (!result.error) setFavorited(!!result.favorited);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={favorited ? "Remover dos favoritos" : "Favoritar"}
      className={cn("text-primary hover:opacity-70 disabled:opacity-60", className)}
    >
      <Heart size={18} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
