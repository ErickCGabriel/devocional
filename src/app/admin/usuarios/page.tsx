import Link from "next/link";
import { getAdminUsers } from "@/lib/queries-admin";

const PLAN_LABELS: Record<string, string> = {
  free: "Grátis",
  mensal: "Mensal",
  anual: "Anual",
  vitalicio: "Vitalício",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await getAdminUsers(q);

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="font-serif text-xl font-semibold text-zinc-900">Usuários</h1>
        <p className="text-sm text-zinc-500">{users.length} encontrados</p>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por e-mail ou nome..."
          className="w-full max-w-sm rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Buscar
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Plano</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/usuarios/${u.id}`} className="font-medium text-zinc-900 hover:underline">
                    {u.full_name || "(sem nome)"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.plan === "free"
                        ? "inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
                        : "inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                    }
                  >
                    {PLAN_LABELS[u.plan] ?? u.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
