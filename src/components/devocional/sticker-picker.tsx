"use client";

import { useState, useTransition } from "react";
import { ImagePlus } from "lucide-react";
import { setEntrySticker } from "@/lib/actions-devotional";
import { STICKERS } from "@/lib/stickers";
import { cn } from "@/lib/utils";

export function StickerPicker({
  devotionalId,
  entryDate,
  initialStickerKey,
}: {
  devotionalId: string;
  entryDate: string;
  initialStickerKey: string | null;
}) {
  const [selected, setSelected] = useState(initialStickerKey);
  const [, startTransition] = useTransition();

  function handleSelect(key: string) {
    const next = selected === key ? null : key;
    setSelected(next);
    startTransition(async () => {
      await setEntrySticker(devotionalId, entryDate, next);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm text-muted">
        <ImagePlus size={16} />
        Adicionar figura
      </span>
      <div className="flex gap-1.5">
        {STICKERS.map((sticker) => (
          <button
            key={sticker.key}
            type="button"
            title={sticker.label}
            onClick={() => handleSelect(sticker.key)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              selected === sticker.key
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-primary/50",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sticker.src} alt={sticker.label} width={28} height={28} />
          </button>
        ))}
      </div>
    </div>
  );
}
