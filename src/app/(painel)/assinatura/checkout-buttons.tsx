"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  plan,
  children,
}: {
  plan: "mensal" | "vitalicio";
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Não foi possível iniciar o checkout. Tente novamente.");
      setLoading(false);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} className="w-full">
        {loading ? "Redirecionando..." : children}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Não foi possível abrir o portal. Tente novamente.");
      setLoading(false);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={loading} variant="outline">
        {loading ? "Redirecionando..." : "Gerenciar assinatura"}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
