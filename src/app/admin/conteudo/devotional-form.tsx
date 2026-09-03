"use client";

import { useActionState } from "react";
import type { AdminActionResult } from "@/lib/actions-admin";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300";
const labelClass = "text-sm font-medium text-zinc-700";

export interface DevotionalFormValues {
  devotional_date: string;
  title: string;
  verse_reference: string;
  verse_text: string;
  reading: string;
}

export function DevotionalForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: AdminActionResult, formData: FormData) => Promise<AdminActionResult>;
  initialValues?: DevotionalFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="devotional_date">
          Data
        </label>
        <input
          id="devotional_date"
          name="devotional_date"
          type="date"
          defaultValue={initialValues?.devotional_date}
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
          placeholder="Ex: A paz que excede todo entendimento"
          required
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="verse_reference">
            Referência do versículo
          </label>
          <input
            id="verse_reference"
            name="verse_reference"
            type="text"
            defaultValue={initialValues?.verse_reference}
            placeholder="Ex: Filipenses 4:6-7"
            required
            className={fieldClass}
          />
        </div>
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
          placeholder="O texto exibido em destaque no topo do devocional"
          required
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="reading">
          Instrução de leitura
        </label>
        <textarea
          id="reading"
          name="reading"
          rows={2}
          defaultValue={initialValues?.reading}
          placeholder='Ex: "Leia Filipenses 4:4-9 e observe a conexão entre oração, gratidão e paz."'
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
