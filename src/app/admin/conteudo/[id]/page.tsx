import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminDevotionalById } from "@/lib/queries-admin";
import { updateDevotionalAction } from "@/lib/actions-admin";
import { DevotionalForm } from "../devotional-form";

export default async function EditDevotionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const devotional = await getAdminDevotionalById(id);
  if (!devotional) notFound();

  const action = updateDevotionalAction.bind(null, id);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/conteudo"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Devocionais
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Editar devocional</h1>
      <DevotionalForm
        action={action}
        submitLabel="Salvar alterações"
        initialValues={{
          devotional_date: devotional.devotional_date,
          title: devotional.title,
          verse_reference: devotional.verse_reference,
          verse_text: devotional.verse_text,
          reading: devotional.reading,
        }}
      />
    </div>
  );
}
