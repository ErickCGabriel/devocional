import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfileNameAction, updateProfileDetailsAction } from "@/lib/actions-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { GENERO_OPTIONS, RELIGIAO_OPTIONS, OBJETIVO_OPTIONS } from "@/lib/profile-options";

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

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Sobre você
        </h2>
        <form action={updateProfileDetailsAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                name="idade"
                type="number"
                min={1}
                max={120}
                defaultValue={profile?.idade ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="genero">Gênero</Label>
              <Select id="genero" name="genero" defaultValue={profile?.genero ?? ""}>
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
            <Select id="religiao" name="religiao" defaultValue={profile?.religiao ?? ""}>
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
            <Select id="objetivo" name="objetivo" defaultValue={profile?.objetivo ?? ""}>
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
          <Button type="submit">Salvar</Button>
        </form>
      </Card>
    </div>
  );
}
