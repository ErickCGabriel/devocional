"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { updateThemeAction } from "@/lib/actions-profile";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types/database";

const THEMES: { value: Theme; label: string; premium: boolean; swatch: string }[] = [
  { value: "padrao", label: "Padrão", premium: false, swatch: "#fbf3f2" },
  { value: "sepia", label: "Sépia", premium: true, swatch: "#f3e9db" },
  { value: "escuro", label: "Escuro", premium: true, swatch: "#201417" },
];

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
    if (theme !== "padrao" && !isPremium) return;
    startTransition(async () => {
      await updateThemeAction(theme);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {THEMES.map((theme) => {
        const locked = theme.premium && !isPremium;
        return (
          <button
            key={theme.value}
            type="button"
            disabled={isPending || locked}
            onClick={() => handleSelect(theme.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm",
              current === theme.value ? "border-primary ring-1 ring-primary" : "border-border",
              locked && "opacity-60",
            )}
          >
            <span
              className="h-8 w-8 rounded-full border border-border"
              style={{ background: theme.swatch }}
            />
            <span className="flex items-center gap-1 font-medium text-foreground">
              {locked && <Lock size={12} />}
              {theme.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
