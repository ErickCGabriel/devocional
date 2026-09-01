-- ---------------------------------------------------------------------------
-- user_commitments — compromissos religiosos recorrentes (missa, culto,
-- encontro...), repetindo em um ou mais dias da semana escolhidos pelo
-- usuário. Exibidos no calendário.
-- ---------------------------------------------------------------------------
create table public.user_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  weekdays smallint[] not null check (
    array_length(weekdays, 1) > 0 and weekdays <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]
  ),
  time_of_day time,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_commitments_user_idx on public.user_commitments (user_id);

alter table public.user_commitments enable row level security;

create policy "commitments_select_own" on public.user_commitments
  for select using (auth.uid() = user_id);
create policy "commitments_insert_own" on public.user_commitments
  for insert with check (auth.uid() = user_id);
create policy "commitments_update_own" on public.user_commitments
  for update using (auth.uid() = user_id);
create policy "commitments_delete_own" on public.user_commitments
  for delete using (auth.uid() = user_id);

create trigger commitments_set_updated_at
  before update on public.user_commitments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- notes.due_date — data opcional atrelada à nota, tornando-a também um
-- lembrete/tarefa visível no calendário.
-- ---------------------------------------------------------------------------
alter table public.notes
  add column due_date date;

create index notes_due_date_idx on public.notes (user_id, due_date);
