import { redirect } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { getCurrentUser, getNotes } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { FREE_NOTES_LIMIT } from "@/lib/limits";
import { Card, Badge } from "@/components/ui/card";
import { NoteForm } from "./note-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteNoteAction } from "@/lib/actions-notes";

export default async function NotasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [notes, subscription] = await Promise.all([
    getNotes(user.id),
    getSubscription(),
  ]);

  const atLimit = !subscription.isPremium && notes.length >= FREE_NOTES_LIMIT;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Notas</h1>
        <p className="text-sm text-muted">
          {subscription.isPremium
            ? "Suas anotações livres, ilimitadas."
            : `${notes.length} de ${FREE_NOTES_LIMIT} notas do plano gratuito.`}
        </p>
      </div>

      <Card>
        <NoteForm disabled={atLimit} />
      </Card>

      <div className="space-y-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {note.title && (
                    <h3 className="font-medium text-foreground">{note.title}</h3>
                  )}
                  {note.due_date && (
                    <Badge className="flex items-center gap-1 bg-warning/15 text-warning">
                      <CalendarClock size={11} />
                      {new Date(note.due_date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
                  {note.content}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(note.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <DeleteButton action={deleteNoteAction.bind(null, note.id)} />
            </div>
          </Card>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-muted">Você ainda não tem notas salvas.</p>
        )}
      </div>
    </div>
  );
}
