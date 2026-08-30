# Meu Devocional

App web para devocional diário: versículo, leitura, reflexão, aplicação e
oração guiados, com sequência de dias, planos de leitura, pedidos de oração,
notas e favoritos. Modelo freemium (gratuito com anúncios + Premium mensal
ou vitalício via Stripe).

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack) + **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + Row Level Security)
- **Stripe** (Checkout + Billing Portal + Webhooks) — assinatura mensal e
  pagamento único (vitalício)
- **Google AdSense** — anúncios apenas para usuários do plano gratuito
- **Vercel** — hospedagem recomendada

> Nesta versão do Next.js o arquivo de middleware foi renomeado de
> `middleware.ts` para `proxy.ts` (`src/proxy.ts`). O comportamento é o
> mesmo, só mudou o nome do arquivo e da função exportada.

## Estrutura de pastas

```
src/
  app/
    (auth pages)         login/, cadastro/, auth/callback/
    (painel)/            grupo de rotas protegidas (não aparece na URL)
      layout.tsx          sidebar + navegação + gate de autenticação
      painel/              dashboard "Início"
      devocional/          devocional do dia (autosave)
      planos/              planos de leitura + planos/[slug]
      calendario/          calendário mensal + streak
      oracao/              pedidos de oração
      notas/               anotações livres
      favoritos/           versículos favoritados
      estatisticas/        estatísticas do usuário
      configuracoes/       perfil, tema, assinatura
      assinatura/          planos e checkout Stripe
    api/stripe/           checkout/, portal/, webhook/
  components/            ui/, layout/, devocional/, calendar/, ads/, auth/
  lib/
    supabase/            client.ts (browser), server.ts (SSR), service.ts
                         (service role), proxy.ts (refresh de sessão)
    actions-*.ts         Server Actions (mutações)
    queries.ts           leituras/consultas ao Supabase
    subscription.ts      helper isPremium()
    stripe.ts            cliente Stripe + IDs de preço
    types/database.ts    tipos do banco (gerar via Supabase CLI depois)
proxy.ts (src/proxy.ts)  refresh de sessão + proteção de rotas
supabase/
  migrations/0001_init.sql  schema completo + RLS + triggers
  seed.sql                  conteúdo de exemplo para desenvolvimento
```

## Modelo de dados

Tabelas principais (ver `supabase/migrations/0001_init.sql` para o SQL
completo, incluindo RLS e triggers):

| Tabela | Descrição |
|---|---|
| `profiles` | Nome, avatar, tema visual — espelha `auth.users` |
| `devotionals` | Conteúdo editorial diário (versículo, leitura, prompts) |
| `weekly_verses` | Versículo da semana |
| `user_devotional_entries` | Respostas privadas do usuário ao devocional (RLS) |
| `reading_plans` / `reading_plan_days` | Planos de leitura e seus dias |
| `user_plan_progress` | Progresso privado do usuário em cada plano (RLS) |
| `streaks` | Sequência atual/recorde, mantida por trigger |
| `prayer_requests` | Pedidos de oração por pessoa (ativo/respondido) |
| `favorites` | Versículos favoritados |
| `notes` | Anotações livres |
| `subscriptions` | Plano (free/mensal/anual/vitalicio), status, IDs do Stripe |

Todas as tabelas de dados privados têm **Row Level Security habilitada**,
restringindo leitura/escrita a `auth.uid() = user_id`. Um trigger em
`auth.users` cria automaticamente `profiles`, `streaks` e `subscriptions`
(plano free) para cada novo usuário. Outro trigger recalcula o streak
sempre que uma entrada de devocional é marcada como concluída.

## Features exclusivas do plano Premium

Definidas em `src/lib/subscription.ts` (`getSubscription().isPremium`) e
aplicadas em cada página:

- **Sem anúncios** (`components/ads/ad-slot.tsx` só renderiza para free)
- **Todos os planos de leitura** liberados (planos com `is_premium = true`
  ficam bloqueados no free — ver `app/(painel)/planos`)
- **Notas e favoritos ilimitados** (free: 20 cada — `src/lib/limits.ts`)
- **Temas visuais** exclusivos (free: só Feminino e Masculino —
  `app/(painel)/configuracoes/theme-switcher.tsx`)
- **Histórico/estatísticas avançadas** (placeholder em `/estatisticas`)

## Configuração

### 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

### 2. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings > API**, copie `Project URL`, `anon public key` e
   `service_role key` para `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
3. Aplique o schema:
   - Via CLI: `npx supabase link --project-ref <id>` e depois
     `npx supabase db push` (aplica `supabase/migrations/0001_init.sql`).
   - Ou cole o conteúdo do arquivo diretamente no **SQL Editor** do painel
     Supabase.
4. (Opcional, dev) rode `supabase/seed.sql` no SQL Editor para ter
   devocionais, versículo da semana e planos de exemplo.
5. Gere os tipos TypeScript reais (substitui o arquivo manual):
   ```bash
   npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts
   ```

### 3. Stripe

1. Crie uma conta em [stripe.com](https://stripe.com) (modo teste é suficiente
   para desenvolver).
2. Em **Developers > API keys**, copie a chave secreta e a publicável para
   `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Em **Product catalog**, crie dois produtos/preços:
   - **Premium mensal** — recorrente, mensal → copie o `price_id` para
     `STRIPE_PRICE_MENSAL`.
   - **Premium vitalício** — pagamento único → copie o `price_id` para
     `STRIPE_PRICE_VITALICIO`.
4. Configure o webhook em **Developers > Webhooks**, apontando para
   `https://SEU_DOMINIO/api/stripe/webhook`, escutando pelo menos:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copie o *signing secret* para
   `STRIPE_WEBHOOK_SECRET`.
5. Para testar localmente, use a Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 4. Google AdSense (opcional em dev)

Preencha `NEXT_PUBLIC_ADSENSE_CLIENT_ID` com o `ca-pub-...` da sua conta
AdSense. Sem essa variável, o componente de anúncios simplesmente não
renderiza nada (útil para desenvolver sem anúncios).

### 5. Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Configure as mesmas variáveis de ambiente do `.env.local` no painel do
   projeto (Production e Preview).
3. Atualize `NEXT_PUBLIC_SITE_URL` para a URL de produção — ela é usada nos
   redirects do Stripe Checkout.
4. Aponte o webhook do Stripe para `https://SEU_DOMINIO_VERCEL/api/stripe/webhook`.
5. Deploy automático a cada push na branch principal.

## Comandos

```bash
npm run dev     # ambiente de desenvolvimento (Turbopack)
npm run build   # build de produção
npm run start   # servir build de produção
npm run lint    # ESLint
```
