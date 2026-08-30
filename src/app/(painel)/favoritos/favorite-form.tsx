"use client";

import { useActionState, useRef, useEffect } from "react";
import { addFavoriteAction } from "@/lib/actions-favorites";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function FavoriteForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, pending] = useActionState(addFavoriteAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  if (disabled) {
    return (
      <p className="text-sm text-muted">
        Você atingiu o limite de favoritos do plano gratuito. Assine o
        Premium para favoritos ilimitados.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Input name="verseReference" required placeholder="Referência (ex: João 3:16)" />
      <Textarea name="verseText" rows={2} placeholder="Texto do versículo (opcional)" />
      <Input name="note" placeholder="Sua nota (opcional)" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Favoritar"}
      </Button>
    </form>
  );
}
