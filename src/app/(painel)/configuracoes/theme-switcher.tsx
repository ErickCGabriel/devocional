"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import { updateThemeAction } from "@/lib/actions-profile";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types/database";

const FREE_THEMES: { value: Theme; label: string; swatch: string }[] = [
  { value: "feminino", label: "Feminino", swatch: "#c85a7a" },
  { value: "masculino", label: "Masculino", swatch: "#18181b" },
];

const PREMIUM_THEME_COUNT = 4;

export function ThemeSwitcher({
  current,
  isPremium,
}: {
  current: Theme;
  isPremium: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSelect(theme: Theme) {
    startTransition(async () => {
      await updateThemeAction(theme);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {FREE_THEMES.map((theme) => (
          <button
            key={theme.value}
            type="button"
            disabled={isPending}
            onClick={() => handleSelect(theme.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm",
              current === theme.value
                ? "border-primary ring-1 ring-primary"
                : "border-border",
            )}
          >
            <span
              className="h-8 w-8 rounded-full border border-border"
              style={{ background: theme.swatch }}
            />
            <span className="font-medium text-foreground">{theme.label}</span>
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Sparkles size={13} />
          Mais {PREMIUM_THEME_COUNT} temas exclusivos chegando no plano Premium
        </p>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: PREMIUM_THEME_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex h-14 items-center justify-center rounded-lg border border-dashed border-border text-muted"
              title={isPremium ? "Em breve" : "Exclusivo do plano Premium"}
            >
              <Lock size={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
