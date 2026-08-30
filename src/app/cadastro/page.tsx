import Link from "next/link";
import { SignUpForm } from "./signup-form";
import { Logo } from "@/components/auth/logo";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-accent-soft/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
        </div>
        <Card>
          <h1 className="font-serif text-xl font-semibold text-foreground">
            Crie sua conta grátis
          </h1>
          <p className="mt-1 text-sm text-muted">
            Comece seu devocional diário hoje mesmo.
          </p>
          <SignUpForm />
          <p className="mt-6 text-center text-sm text-muted">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
