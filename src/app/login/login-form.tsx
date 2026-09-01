"use client";

import { useActionState, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  signInAction,
  resendConfirmationAction,
  type AuthActionState,
} from "@/lib/actions-auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthActionState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/painel";
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialState,
  );
  const [resendState, setResendState] = useState<AuthActionState | null>(null);
  const [isResending, startResend] = useTransition();

  function handleResend() {
    if (!state.unconfirmedEmail) return;
    startResend(async () => {
      const result = await resendConfirmationAction(state.unconfirmedEmail!);
      setResendState(result);
    });
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@exemplo.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>
      {state?.error && (
        <div role="alert">
          <p className="text-sm text-error">{state.error}</p>
          {state.unconfirmedEmail && !resendState?.message && (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              {isResending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
            </button>
          )}
          {resendState?.message && (
            <p className="mt-1 text-sm text-success">{resendState.message}</p>
          )}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
