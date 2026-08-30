"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteAccountAction } from "@/lib/actions-account";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const CONFIRM_WORD = "EXCLUIR";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccountAction();
      if (result?.error) setError(result.error);
    });
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <AlertTriangle size={16} />
        Excluir minha conta
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Isso apaga permanentemente sua conta e todos os seus dados —
        devocionais, respostas, orações, notas, favoritos e progresso nos
        planos. Não é possível desfazer.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="confirmDelete" className="text-red-800">
          Digite <strong>{CONFIRM_WORD}</strong> para confirmar
        </Label>
        <Input
          id="confirmDelete"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_WORD}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setOpen(false);
            setConfirmText("");
            setError(null);
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          disabled={confirmText !== CONFIRM_WORD || isPending}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {isPending ? "Excluindo..." : "Excluir permanentemente"}
        </Button>
      </div>
    </div>
  );
}
