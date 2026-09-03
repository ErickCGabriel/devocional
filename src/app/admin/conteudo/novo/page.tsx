import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createDevotionalAction } from "@/lib/actions-admin";
import { DevotionalForm } from "../devotional-form";

export default function NewDevotionalPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/conteudo"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Devocionais
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Novo devocional</h1>
      <DevotionalForm action={createDevotionalAction} submitLabel="Criar devocional" />
    </div>
  );
}
