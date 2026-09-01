"use client";

import { useActionState, useRef, useEffect } from "react";
import { CalendarPlus } from "lucide-react";
import { addCommitmentAction, deleteCommitmentAction } from "@/lib/actions-commitments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/ui/delete-button";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

export interface CommitmentRow {
  id: string;
  title: string;
  weekdays: number[];
  time_of_day: string | null;
}

export function CommitmentsManager({ commitments }: { commitments: CommitmentRow[] }) {
  const [state, formAction, pending] = useActionState(addCommitmentAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <div className="space-y-4">
      {commitments.length > 0 && (
        <ul className="space-y-2">
          {commitments.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{c.title}</p>
                <p className="text-xs text-muted">
                  {c.weekdays
                    .slice()
                    .sort((a, b) => a - b)
                    .map((w) => WEEKDAY_LABELS[w].label)
                    .join(", ")}
                  {c.time_of_day && ` · ${c.time_of_day.slice(0, 5)}`}
                </p>
              </div>
              <DeleteButton action={deleteCommitmentAction.bind(null, c.id)} />
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} action={formAction} className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarPlus size={16} />
          Novo compromisso recorrente
        </div>
        <Input name="title" placeholder="Ex: Culto, Missa, Encontro de jovens" required />
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAY_LABELS.map((w) => (
            <label
              key={w.value}
              className={cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-xs font-medium text-foreground/80 hover:bg-accent-soft has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground",
              )}
            >
              <input
                type="checkbox"
                name="weekdays"
                value={w.value}
                className="sr-only"
              />
              {w.label}
            </label>
          ))}
        </div>
        <Input name="timeOfDay" type="time" className="w-fit" />
        {state?.error && <p className="text-sm text-error">{state.error}</p>}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : "Adicionar compromisso"}
        </Button>
      </form>
    </div>
  );
}
