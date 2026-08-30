-- Meu Devocional — schema inicial
-- Convenção: toda tabela de dados privados do usuário tem RLS habilitado
-- e políticas restringindo o acesso a auth.uid() = user_id.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Função utilitária: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — dados públicos/básicos do usuário, espelha auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  theme text not null default 'padrao' check (theme in ('padrao', 'sepia', 'escuro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- devotionals — conteúdo diário (editorial, não é dado do usuário)
-- ---------------------------------------------------------------------------
create table public.devotionals (
  id uuid primary key default gen_random_uuid(),
  devotional_date date not null unique,
  title text not null,
  verse_reference text not null,
  verse_text text not null,
  reading text not null,
  reflection_prompt text,
  application_prompt text,
  prayer_prompt text,
  created_at timestamptz not null default now()
);

alter table public.devotionals enable row level security;

create policy "devotionals_select_authenticated" on public.devotionals
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- weekly_verses — versículo da semana
-- ---------------------------------------------------------------------------
create table public.weekly_verses (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  verse_reference text not null,
  verse_text text not null,
  reflection text,
  created_at timestamptz not null default now()
);

alter table public.weekly_verses enable row level security;

create policy "weekly_verses_select_authenticated" on public.weekly_verses
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- user_devotional_entries — respostas privadas do usuário ao devocional do dia
-- ---------------------------------------------------------------------------
create table public.user_devotional_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  entry_date date not null,
  reflection text,
  application text,
  prayer text,
  gratitude text,
  notes text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, devotional_id)
);

create index user_devotional_entries_user_date_idx
  on public.user_devotional_entries (user_id, entry_date desc);

alter table public.user_devotional_entries enable row level security;

create policy "entries_select_own" on public.user_devotional_entries
  for select using (auth.uid() = user_id);
create policy "entries_insert_own" on public.user_devotional_entries
  for insert with check (auth.uid() = user_id);
create policy "entries_update_own" on public.user_devotional_entries
  for update using (auth.uid() = user_id);
create policy "entries_delete_own" on public.user_devotional_entries
  for delete using (auth.uid() = user_id);

create trigger entries_set_updated_at
  before update on public.user_devotional_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- reading_plans / reading_plan_days — planos de leitura (conteúdo editorial)
-- ---------------------------------------------------------------------------
create table public.reading_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  total_days integer not null check (total_days > 0),
  is_premium boolean not null default false,
  cover_image_url text,
  created_at timestamptz not null default now()
);

alter table public.reading_plans enable row level security;

create policy "reading_plans_select_authenticated" on public.reading_plans
  for select using (auth.role() = 'authenticated');

create table public.reading_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  passage_reference text not null,
  content text,
  unique (plan_id, day_number)
);

alter table public.reading_plan_days enable row level security;

create policy "reading_plan_days_select_authenticated" on public.reading_plan_days
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- user_plan_progress — progresso privado do usuário em cada plano
-- ---------------------------------------------------------------------------
create table public.user_plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  current_day integer not null default 1,
  completed_days integer[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

alter table public.user_plan_progress enable row level security;

create policy "plan_progress_select_own" on public.user_plan_progress
  for select using (auth.uid() = user_id);
create policy "plan_progress_insert_own" on public.user_plan_progress
  for insert with check (auth.uid() = user_id);
create policy "plan_progress_update_own" on public.user_plan_progress
  for update using (auth.uid() = user_id);
create policy "plan_progress_delete_own" on public.user_plan_progress
  for delete using (auth.uid() = user_id);

create trigger plan_progress_set_updated_at
  before update on public.user_plan_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- streaks — sequência de dias consecutivos (mantida por trigger)
-- ---------------------------------------------------------------------------
create table public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_date date,
  updated_at timestamptz not null default now()
);

alter table public.streaks enable row level security;

create policy "streaks_select_own" on public.streaks
  for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- prayer_requests — pedidos de oração por pessoas
-- ---------------------------------------------------------------------------
create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_name text not null,
  description text,
  status text not null default 'ativo' check (status in ('ativo', 'respondido')),
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prayer_requests enable row level security;

create policy "prayer_requests_select_own" on public.prayer_requests
  for select using (auth.uid() = user_id);
create policy "prayer_requests_insert_own" on public.prayer_requests
  for insert with check (auth.uid() = user_id);
create policy "prayer_requests_update_own" on public.prayer_requests
  for update using (auth.uid() = user_id);
create policy "prayer_requests_delete_own" on public.prayer_requests
  for delete using (auth.uid() = user_id);

create trigger prayer_requests_set_updated_at
  before update on public.prayer_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- favorites — versículos/trechos favoritados
-- ---------------------------------------------------------------------------
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verse_reference text not null,
  verse_text text,
  note text,
  source text check (source in ('devocional', 'plano', 'manual')),
  source_id uuid,
  created_at timestamptz not null default now()
);

alter table public.favorites enable row level security;

create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- notes — anotações livres do usuário
-- ---------------------------------------------------------------------------
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  devotional_id uuid references public.devotionals(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "notes_select_own" on public.notes
  for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes
  for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes
  for update using (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes
  for delete using (auth.uid() = user_id);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- subscriptions — plano/assinatura do usuário (Stripe)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'mensal', 'anual', 'vitalicio')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Novo usuário: cria profile, streak e subscription (free) automaticamente
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.streaks (user_id) values (new.id);

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Atualiza streak quando uma entrada de devocional é marcada como concluída
-- ---------------------------------------------------------------------------
create or replace function public.handle_devotional_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_date date;
  cur_streak integer;
  best_streak integer;
begin
  if new.completed is distinct from true or (old is not null and old.completed is true) then
    return new;
  end if;

  select last_completed_date, current_streak, longest_streak
    into prev_date, cur_streak, best_streak
    from public.streaks
    where user_id = new.user_id
    for update;

  if prev_date is null then
    cur_streak := 1;
  elsif prev_date = new.entry_date then
    cur_streak := coalesce(cur_streak, 0);
  elsif prev_date = new.entry_date - interval '1 day' then
    cur_streak := coalesce(cur_streak, 0) + 1;
  elsif prev_date > new.entry_date then
    -- entrada retroativa antiga, não mexe na sequência atual
    return new;
  else
    cur_streak := 1;
  end if;

  best_streak := greatest(coalesce(best_streak, 0), cur_streak);

  update public.streaks
    set current_streak = cur_streak,
        longest_streak = best_streak,
        last_completed_date = greatest(coalesce(prev_date, new.entry_date), new.entry_date),
        updated_at = now()
    where user_id = new.user_id;

  return new;
end;
$$;

create trigger on_devotional_entry_completed
  after insert or update on public.user_devotional_entries
  for each row execute function public.handle_devotional_completed();
