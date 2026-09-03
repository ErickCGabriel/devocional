"use client";

import { useActionState } from "react";
import type { AdminActionResult } from "@/lib/actions-admin";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300";
const labelClass = "text-sm font-medium text-zinc-700";

export interface PlanFormValues {
  slug: string;
  title: string;
  description: string | null;
  total_days: number;
  is_premium: boolean;
  cover_image_url: string | null;
}

export function PlanForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: AdminActionResult, formData: FormData) => Promise<AdminActionResult>;
  initialValues?: PlanFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminActionResult, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="title">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={initialValues?.title}
            placeholder="Ex: Evangelho de João em 21 dias"
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="slug">
            Slug (na URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={initialValues?.slug}
            placeholder="evangelho-de-joao"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initialValues?.description ?? ""}
          placeholder="Uma frase explicando do que se trata o plano"
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="total_days">
            Total de dias
          </label>
          <input
            id="total_days"
            name="total_days"
            type="number"
            min={1}
            defaultValue={initialValues?.total_days}
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="cover_image_url">
            URL da imagem de capa (opcional)
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            type="text"
            defaultValue={initialValues?.cover_image_url ?? ""}
            placeholder="/illustrations/..."
            className={fieldClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="is_premium"
          defaultChecked={initialValues?.is_premium}
          className="h-4 w-4 rounded border-zinc-300"
        />
        Exclusivo do plano premium
      </label>

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
