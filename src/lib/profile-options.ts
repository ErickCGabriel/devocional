import type { Genero, Objetivo, Religiao } from "@/lib/types/database";

export const GENERO_OPTIONS: { value: Genero; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
];

export const RELIGIAO_OPTIONS: { value: Religiao; label: string }[] = [
  { value: "catolico", label: "Católico" },
  { value: "evangelico", label: "Evangélico / Protestante" },
  { value: "espirita", label: "Espírita" },
  { value: "outra_crista", label: "Outra religião cristã" },
  { value: "outra_religiao", label: "Outra religião" },
  { value: "sem_religiao", label: "Sem religião" },
  { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
];

export const OBJETIVO_OPTIONS: { value: Objetivo; label: string }[] = [
  { value: "habito_diario", label: "Criar um hábito diário" },
  { value: "crescer_na_fe", label: "Crescer na fé" },
  { value: "estudar_biblia", label: "Estudar mais a Bíblia" },
  { value: "momento_dificil", label: "Superar um momento difícil" },
];

export function labelFor<T extends { value: string; label: string }>(
  options: T[],
  value: string | null | undefined,
): string {
  return options.find((o) => o.value === value)?.label ?? "—";
}
