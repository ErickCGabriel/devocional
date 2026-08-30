import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfileNameAction } from "@/lib/actions-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Perfil</h1>
        <p className="text-sm text-muted">{user.email}</p>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Dados pessoais</h2>
        <form action={updateProfileNameAction} className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="fullName">Nome</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.full_name ?? ""}
            />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card>
    </div>
  );
}
