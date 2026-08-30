import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/auth/logo";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-accent-soft/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
        </div>
        <Card>
          <h1 className="font-serif text-xl font-semibold text-foreground">
            Bem-vindo(a) de volta
          </h1>
          <p className="mt-1 text-sm text-muted">
            Entre para continuar seu devocional diário.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-muted">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-primary">
              Criar conta grátis
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
