"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { signUpAction, type AuthActionState } from "@/lib/actions-auth";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { GENERO_OPTIONS, RELIGIAO_OPTIONS, OBJETIVO_OPTIONS } from "@/lib/profile-options";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );

  if (state?.message) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-center">
        <Mail size={22} className="text-success" />
        <p className="text-sm text-foreground/90">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Nome</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Seu nome"
        />
      </div>
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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="idade">Idade</Label>
          <Input
            id="idade"
            name="idade"
            type="number"
            min={1}
            max={120}
            required
            placeholder="Ex: 28"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="genero">Gênero</Label>
          <Select id="genero" name="genero" required defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            {GENERO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="religiao">Religião</Label>
        <Select id="religiao" name="religiao" required defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          {RELIGIAO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="objetivo">O que você busca no Meu Devocional?</Label>
        <Select id="objetivo" name="objetivo" required defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          {OBJETIVO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}
