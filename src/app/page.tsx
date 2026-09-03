import Link from "next/link";
import {
  BookOpen,
  Flame,
  ListChecks,
  HeartHandshake,
  Star,
  PenLine,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Devocional diário",
    description:
      "Versículo, leitura, reflexão, aplicação e oração guiados todos os dias.",
  },
  {
    icon: Flame,
    title: "Sequência de dias",
    description:
      "Acompanhe sua constância com streak e calendário mensal de progresso.",
  },
  {
    icon: ListChecks,
    title: "Planos de leitura",
    description:
      "Do Evangelho de João à Bíblia em 1 ano, com progresso salvo automaticamente.",
  },
  {
    icon: HeartHandshake,
    title: "Oração por pessoas",
    description: "Liste pedidos de oração e marque quando forem respondidos.",
  },
  {
    icon: Star,
    title: "Notas e favoritos",
    description: "Guarde versículos e reflexões marcantes para revisitar.",
  },
  {
    icon: PenLine,
    title: "Autosave",
    description: "Suas respostas são salvas automaticamente enquanto você escreve.",
  },
];

const steps = [
  {
    number: "1",
    title: "Leia",
    description: "Um versículo e uma leitura curta, escolhidos para o seu dia.",
  },
  {
    number: "2",
    title: "Reflita",
    description: "Perguntas guiadas de reflexão e aplicação, sem enrolação.",
  },
  {
    number: "3",
    title: "Ore",
    description: "Espaço para orar, agradecer e anotar o que Deus falou hoje.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
          <span className="flex items-center gap-1.5 whitespace-nowrap font-serif text-base font-semibold text-primary sm:text-lg">
            <span aria-hidden>✝</span> Meu Devocional
          </span>
          <nav className="flex items-center gap-1.5 sm:gap-3">
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
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent-soft/70 to-background">
          <div className="mx-auto max-w-3xl px-6 pb-24 pt-20 text-center sm:pb-32 sm:pt-28">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Seu tempo diário com Deus, guiado e organizado.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              Devocional, planos de leitura, pedidos de oração e sua sequência
              de dias — tudo em um só lugar, salvo automaticamente.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cadastro">
                <Button size="lg" className="w-full sm:w-auto">
                  Criar minha conta grátis
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">
              Grátis para começar · sem cartão de crédito
            </p>
          </div>
          <div
            aria-hidden
            className="landing-hero-band absolute inset-x-0 bottom-0 h-16 sm:h-24"
          />
        </section>

        {/* Versículo — reforça a identidade devocional logo de cara */}
        <section className="border-b border-border bg-surface/60">
          <div className="mx-auto max-w-2xl px-6 py-10 text-center">
            <p className="font-script text-2xl leading-snug text-primary sm:text-3xl">
              &ldquo;Aquietem-se, e saibam que eu sou Deus.&rdquo;
            </p>
            <p className="mt-2 text-sm font-medium text-muted">Salmos 46:10</p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground">
            Três passos, todos os dias
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground">
                  {step.number}
                </span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="border-t border-border bg-surface/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center font-serif text-2xl font-semibold text-foreground">
              Tudo que você precisa pra manter o hábito
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-primary">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground">
            Gratuito para começar, premium para ir mais fundo
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Card>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Gratuito
              </h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">R$ 0</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  Devocional diário completo
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  1 plano de leitura gratuito
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  Notas e favoritos (até 20 cada)
                </li>
              </ul>
            </Card>
            <Card className="border-primary/50 ring-1 ring-primary/30">
              <span className="mb-1 inline-flex items-center rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">
                Mais popular
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Premium
              </h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                R$ 9,90<span className="text-sm font-normal text-muted">/mês</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  Sem anúncios
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  Todos os planos de leitura liberados
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  Temas visuais exclusivos e notas ilimitadas
                </li>
              </ul>
            </Card>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Também disponível o plano anual (R$ 99/ano) e o vitalício, pagamento único.
          </p>
        </section>

        {/* CTA final */}
        <section className="bg-primary">
          <div className="mx-auto max-w-2xl px-6 py-14 text-center">
            <h2 className="font-serif text-2xl font-semibold text-primary-foreground sm:text-3xl">
              Comece seu tempo diário com Deus hoje.
            </h2>
            <Link href="/cadastro" className="mt-6 inline-block">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:opacity-90"
              >
                Criar minha conta grátis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        <p>Meu Devocional — feito para o seu tempo diário com Deus.</p>
        <Link href="/privacidade" className="mt-1 inline-block hover:text-foreground">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  );
}
