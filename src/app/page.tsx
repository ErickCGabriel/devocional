import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Devocional diário",
    description:
      "Versículo, leitura, reflexão, aplicação e oração guiados todos os dias.",
  },
  {
    title: "Sequência de dias",
    description:
      "Acompanhe sua constância com streak e calendário mensal de progresso.",
  },
  {
    title: "Planos de leitura",
    description:
      "Do Evangelho de João à Bíblia em 1 ano, com progresso salvo automaticamente.",
  },
  {
    title: "Oração por pessoas",
    description:
      "Liste pedidos de oração e marque quando forem respondidos.",
  },
  {
    title: "Notas e favoritos",
    description: "Guarde versículos e reflexões marcantes para revisitar.",
  },
  {
    title: "Autosave",
    description: "Suas respostas são salvas automaticamente enquanto você escreve.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-serif text-lg font-semibold text-primary">
            Meu Devocional
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Seu tempo diário com Deus, guiado e organizado.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Devocional, planos de leitura, pedidos de oração e sua sequência
            de dias — tudo em um só lugar, salvo automaticamente.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/cadastro">
              <Button size="lg">Criar minha conta grátis</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface/60">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Gratuito para começar, premium para ir mais fundo
            </h2>
            <p className="mt-3 text-muted">
              O plano gratuito já inclui o devocional diário completo. O
              plano premium remove os anúncios e libera todos os planos de
              leitura, temas visuais e histórico avançado de sequência.
            </p>
            <Link href="/cadastro" className="mt-6 inline-block">
              <Button size="lg">Ver planos</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        Meu Devocional — feito para o seu tempo diário com Deus.
      </footer>
    </div>
  );
}
