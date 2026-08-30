"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Heart, HeartHandshake, PenLine } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import {
  autosaveDevotionalEntry,
  autosaveQuestionAnswer,
  markDevotionalCompleted,
  type DevotionalEntryFields,
} from "@/lib/actions-devotional";
import type { DevotionalQuestionWithAnswer } from "@/lib/queries";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DevotionalForm({
  entryId,
  devotionalId,
  entryDate,
  reflectionQuestions,
  applicationQuestions,
  prayerQuestions,
  initialFields,
  alreadyCompleted,
}: {
  entryId: string;
  devotionalId: string;
  entryDate: string;
  reflectionQuestions: DevotionalQuestionWithAnswer[];
  applicationQuestions: DevotionalQuestionWithAnswer[];
  prayerQuestions: DevotionalQuestionWithAnswer[];
  initialFields: DevotionalEntryFields;
  alreadyCompleted: boolean;
}) {
  const [fields, setFields] = useState<DevotionalEntryFields>(initialFields);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [isPending, startTransition] = useTransition();

  const debouncedSaveFields = useDebouncedCallback(
    (next: DevotionalEntryFields) => {
      setStatus("saving");
      startTransition(async () => {
        const result = await autosaveDevotionalEntry(devotionalId, entryDate, next);
        setStatus(result.error ? "error" : "saved");
      });
    },
    900,
  );

  function updateField(key: keyof DevotionalEntryFields, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    debouncedSaveFields(next);
  }

  function handleComplete() {
    startTransition(async () => {
      const result = await markDevotionalCompleted(devotionalId, entryDate, fields);
      if (!result.error) setCompleted(true);
      setStatus(result.error ? "error" : "saved");
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <section className="space-y-4">
          <FieldCard icon={<PenLine size={16} />} title="1. Reflexão">
            <div className="space-y-4">
              {reflectionQuestions.map((q) => (
                <QuestionField
                  key={q.id}
                  entryId={entryId}
                  question={q}
                  onSaveStatus={setStatus}
                  rows={2}
                />
              ))}
            </div>
          </FieldCard>

          <FieldCard icon={<HeartHandshake size={16} />} title="Oração">
            <div className="space-y-4">
              {prayerQuestions.map((q) => (
                <QuestionField
                  key={q.id}
                  entryId={entryId}
                  question={q}
                  onSaveStatus={setStatus}
                  rows={2}
                />
              ))}
            </div>
          </FieldCard>
        </section>

        <section className="space-y-4">
          <FieldCard icon={<PenLine size={16} />} title="2. Aplicação">
            <div className="space-y-4">
              {applicationQuestions.map((q) => (
                <QuestionField
                  key={q.id}
                  entryId={entryId}
                  question={q}
                  onSaveStatus={setStatus}
                  rows={2}
                />
              ))}
            </div>
          </FieldCard>

          <FieldCard icon={<Heart size={16} />} title="Agradecer" hint="Pelo que quero agradecer hoje?">
            <Textarea
              rows={3}
              value={fields.gratitude ?? ""}
              onChange={(e) => updateField("gratitude", e.target.value)}
              placeholder="Escreva sua gratidão..."
            />
          </FieldCard>
        </section>
      </div>

      <FieldCard
        icon={<PenLine size={16} />}
        title="Anotações livres"
        hint="Escreva aqui o que mais o Senhor colocar no seu coração."
      >
        <Textarea
          rows={3}
          value={fields.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Anotações livres..."
        />
      </FieldCard>

      <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
        <div className="text-sm text-muted">
          {status === "saving" && "Salvando..."}
          {status === "saved" && "Alterações salvas automaticamente"}
          {status === "error" && (
            <span className="text-red-600">Erro ao salvar. Tente novamente.</span>
          )}
          {status === "idle" && (
            <Link href="/oracao" className="text-primary hover:underline">
              Ver pedidos de oração →
            </Link>
          )}
        </div>
        <Button onClick={handleComplete} disabled={isPending || completed}>
          <Check size={16} />
          {completed ? "Devocional concluído" : "Salvar devocional"}
        </Button>
      </div>
    </div>
  );
}

function QuestionField({
  entryId,
  question,
  onSaveStatus,
  rows,
}: {
  entryId: string;
  question: DevotionalQuestionWithAnswer;
  onSaveStatus: (status: SaveStatus) => void;
  rows: number;
}) {
  const [value, setValue] = useState(question.answer);
  const [, startTransition] = useTransition();

  const debouncedSave = useDebouncedCallback((next: string) => {
    onSaveStatus("saving");
    startTransition(async () => {
      const result = await autosaveQuestionAnswer(entryId, question.id, next);
      onSaveStatus(result.error ? "error" : "saved");
    });
  }, 900);

  return (
    <div>
      <p className="mb-1.5 text-xs text-muted">{question.question}</p>
      <Textarea
        rows={rows}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedSave(e.target.value);
        }}
        placeholder="Escreva sua resposta..."
      />
    </div>
  );
}

function FieldCard({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
        {icon}
        {title}
      </div>
      {hint && <p className="mb-2 text-xs text-muted">{hint}</p>}
      {children}
    </div>
  );
}
