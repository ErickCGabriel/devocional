"use client";

import { useActionState, useRef, useEffect } from "react";
import { addNoteAction } from "@/lib/actions-notes";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function NoteForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, pending] = useActionState(addNoteAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  if (disabled) {
    return (
      <p className="text-sm text-muted">
        Você atingiu o limite de notas do plano gratuito. Assine o Premium
        para notas ilimitadas.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Input name="title" placeholder="Título (opcional)" />
      <Textarea name="content" rows={3} required placeholder="Escreva sua anotação..." />
      <div className="space-y-1.5">
        <label htmlFor="dueDate" className="text-xs text-muted">
          Atrelar a uma data (opcional) — vira lembrete e aparece no calendário
        </label>
        <Input id="dueDate" name="dueDate" type="date" className="w-fit" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar nota"}
      </Button>
    </form>
  );
}
