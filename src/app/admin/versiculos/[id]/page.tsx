import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminFeaturedVerseById } from "@/lib/queries-admin";
import { updateFeaturedVerseAction } from "@/lib/actions-admin";
import { VerseForm } from "../verse-form";

export default async function EditFeaturedVersePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const verse = await getAdminFeaturedVerseById(id);
  if (!verse) notFound();

  const action = updateFeaturedVerseAction.bind(null, id);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/versiculos"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} /> Versículo da semana
      </Link>
      <h1 className="font-serif text-xl font-semibold text-zinc-900">Editar versículo</h1>
      <VerseForm
        action={action}
        submitLabel="Salvar alterações"
        initialValues={{
          verse_reference: verse.verse_reference,
          verse_text: verse.verse_text,
        }}
      />
    </div>
  );
}
