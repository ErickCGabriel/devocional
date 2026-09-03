import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createFeaturedVerseAction } from "@/lib/actions-admin";
import { VerseForm } from "../verse-form";

export default function NewFeaturedVersePage() {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/versiculos"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Versículo da semana
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Novo versículo</h1>
      <VerseForm action={createFeaturedVerseAction} submitLabel="Adicionar ao pool" />
    </div>
  );
}
