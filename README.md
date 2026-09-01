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
      biblia/               Bíblia completa: livros, capítulos, busca
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
  migrations/            0001 schema base, 0002 Bíblia, 0003 temas,
                         0004 banco de perguntas, 0005 favoritos+Bíblia
  scripts/import-bible.sql  importa o texto da Bíblia (fetch externo)
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
| `bible_books` / `bible_verses` | Bíblia completa (Almeida 1911), buscável |
| `devotional_questions` | Banco de perguntas de reflexão/aplicação/oração |
| `user_devotional_answers` | Resposta individual do usuário a cada pergunta sorteada |

Todas as tabelas de dados privados têm **Row Level Security habilitada**,
restringindo leitura/escrita a `auth.uid() = user_id`. Um trigger em
`auth.users` cria automaticamente `profiles`, `streaks` e `subscriptions`
(plano free) para cada novo usuário. Outro trigger recalcula o streak
sempre que uma entrada de devocional é marcada como concluída.

### Perguntas rotativas

Em vez de campos fixos de texto, cada entrada de devocional sorteia (via
trigger `handle_new_devotional_entry` + `pick_random_questions`) 3 perguntas
de reflexão, 2 de aplicação e 3 de oração do banco `devotional_questions` —
uma vez, na criação da entrada (não muda depois, mesmo com autosave). As
respostas ficam em `user_devotional_answers`, uma linha por pergunta. Para
adicionar novas perguntas ao banco, insira em `devotional_questions` com a
`category` correta (`reflexao`, `aplicacao` ou `oracao`).

### Bíblia

O texto é a **Almeida 1911**, domínio público. **Importante**: a ACF
(Almeida Corrigida Fiel) e a NVI, comumente usadas "de graça" em projetos
open source, **não são de domínio público** — são registradas pela
Sociedade Bíblica Trinitariana e pela Biblica, respectivamente. Usá-las
num produto pago sem licença é risco real. Se no futuro quiserem um texto
em português mais atual, as opções são: licenciar via API.Bible/Digital
Bible Platform, ou negociar licença direto com a SBB/SBTB — nunca reusar
JSONs de GitHub sem confirmar a licença.

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

O projeto já está criado: **meu-devocional** (`nmymympzddcwolwbziud`),
região `sa-east-1`, dentro da organização Lootfit. Todas as migrations em
`supabase/migrations/` já foram aplicadas nele, incluindo a Bíblia
completa (Almeida 1911) e o banco de perguntas rotativas.

1. Em [Project Settings → API](https://supabase.com/dashboard/project/nmymympzddcwolwbziud/settings/api),
   copie a `anon public key` (legada, formato JWT) e a `service_role key`
   para `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` no seu
   `.env.local` (a URL e a anon key já vêm preenchidas no `.env.local` deste
   repositório — só falta a `service_role key`, que é secreta e não pode
   ser obtida por automação).
2. Novas migrations: crie o arquivo em `supabase/migrations/000N_nome.sql`
   e aplique via SQL Editor do painel ou `npx supabase db push` (depois de
   `npx supabase link --project-ref nmymympzddcwolwbziud`).
3. Gere os tipos TypeScript reais (substitui o arquivo manual):
   ```bash
   npx supabase gen types typescript --project-id nmymympzddcwolwbziud > src/lib/types/database.ts
   ```

Para criar um projeto **novo** do zero (ex.: ambiente de outro cliente),
aplique as migrations em ordem e rode `supabase/scripts/import-bible.sql`
para a Bíblia (ver seção "Bíblia" abaixo).

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
AdSense (ex.: `ca-pub-4825669797968028`). Sem essa variável, nada de
AdSense é carregado — nem o script global, nem os blocos de anúncio
(útil para desenvolver sem anúncios).

Quando a variável está definida, o script de verificação/carregamento do
AdSense (`pagead2.googlesyndication.com/.../adsbygoogle.js`) é injetado
automaticamente no `<head>` de **todas** as páginas pelo layout raiz
(`src/app/layout.tsx`) — inclusive a landing page pública `/`, que é a
que o Google visita para revisar o site. Não precisa colar o snippet
manualmente em nenhuma página. Os blocos de anúncio em si
(`<AdSlot slot="..." />`) só aparecem para usuários do plano gratuito.

### 5. Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

O domínio de produção é **devocional.space**. O projeto Supabase real
(`meu-devocional`, região `sa-east-1`) já está criado e com o schema
aplicado — só falta configurar a Vercel:

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Configure as variáveis de ambiente do projeto (Production e Preview):
   - `NEXT_PUBLIC_SUPABASE_URL=https://nmymympzddcwolwbziud.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — mesma do `.env.local`
   - `SUPABASE_SERVICE_ROLE_KEY` — pegue em
     [Project Settings → API](https://supabase.com/dashboard/project/nmymympzddcwolwbziud/settings/api)
     (não é possível obter essa chave por automação, é secreta)
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
     `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MENSAL`, `STRIPE_PRICE_VITALICIO`
     — ver seção Stripe acima
   - `NEXT_PUBLIC_SITE_URL=https://devocional.space`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (opcional)
3. Em **Settings → Domains** na Vercel, adicione `devocional.space` e
   siga as instruções de DNS (o registrador do domínio precisa apontar
   para a Vercel).
4. Aponte o webhook do Stripe para
   `https://devocional.space/api/stripe/webhook`.
5. Deploy automático a cada push na branch principal.

## Comandos

```bash
npm run dev     # ambiente de desenvolvimento (Turbopack)
npm run build   # build de produção
npm run start   # servir build de produção
npm run lint    # ESLint
```
