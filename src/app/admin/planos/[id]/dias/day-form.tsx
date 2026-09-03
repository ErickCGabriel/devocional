"use client";

import { useActionState } from "react";
import type { AdminActionResult } from "@/lib/actions-admin";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300";
const labelClass = "text-sm font-medium text-zinc-700";

export interface DayFormValues {
  day_number: number;
  title: string;
  passage_reference: string;
  content: string | null;
}

export function DayForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: AdminActionResult, formData: FormData) => Promise<AdminActionResult>;
  initialValues?: DayFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="day_number">
            Dia nº
          </label>
          <input
            id="day_number"
            name="day_number"
            type="number"
            min={1}
            defaultValue={initialValues?.day_number}
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="title">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={initialValues?.title}
            placeholder="Ex: O Verbo se fez carne"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="passage_reference">
          Referência da passagem
        </label>
        <input
          id="passage_reference"
          name="passage_reference"
          type="text"
          defaultValue={initialValues?.passage_reference}
          placeholder="Ex: João 1:1-18"
          required
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="content">
          Conteúdo / comentário (opcional)
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          defaultValue={initialValues?.content ?? ""}
          placeholder="Um comentário ou reflexão curta sobre a passagem do dia"
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
