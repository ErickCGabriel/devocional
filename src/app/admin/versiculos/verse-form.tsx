"use client";

import { useActionState } from "react";
import type { AdminActionResult } from "@/lib/actions-admin";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300";
const labelClass = "text-sm font-medium text-zinc-700";

export interface VerseFormValues {
  verse_reference: string;
  verse_text: string;
}

export function VerseForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: AdminActionResult, formData: FormData) => Promise<AdminActionResult>;
  initialValues?: VerseFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="verse_reference">
          Referência
        </label>
        <input
          id="verse_reference"
          name="verse_reference"
          type="text"
          defaultValue={initialValues?.verse_reference}
          placeholder="Ex: Salmos 23:1"
          required
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="verse_text">
          Texto do versículo
        </label>
        <textarea
          id="verse_text"
          name="verse_text"
          rows={3}
          defaultValue={initialValues?.verse_text}
          placeholder="O Senhor é o meu pastor; nada me faltará."
          required
          className={fieldClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
