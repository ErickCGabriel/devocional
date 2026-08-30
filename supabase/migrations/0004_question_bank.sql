-- Banco de perguntas rotativas: em vez de campos fixos de reflexão/
-- aplicação/oração, cada seção sorteia algumas perguntas do banco a cada
-- novo devocional (armazenadas na entrada para não mudar depois de criadas).

create table public.devotional_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('reflexao', 'aplicacao', 'oracao')),
  question text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.devotional_questions enable row level security;

create policy "devotional_questions_select_authenticated" on public.devotional_questions
  for select using (auth.role() = 'authenticated');

-- Troca os campos fixos de texto por arrays de perguntas sorteadas.
-- As respostas individuais ficam em user_devotional_answers.
alter table public.user_devotional_entries
  drop column reflection,
  drop column application,
  drop column prayer,
  add column reflection_question_ids uuid[] not null default '{}',
  add column application_question_ids uuid[] not null default '{}',
  add column prayer_question_ids uuid[] not null default '{}';

create table public.user_devotional_answers (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.user_devotional_entries(id) on delete cascade,
  question_id uuid not null references public.devotional_questions(id) on delete cascade,
  answer text,
  updated_at timestamptz not null default now(),
  unique (entry_id, question_id)
);

alter table public.user_devotional_answers enable row level security;

create policy "answers_select_own" on public.user_devotional_answers
  for select using (
    exists (
      select 1 from public.user_devotional_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );
create policy "answers_insert_own" on public.user_devotional_answers
  for insert with check (
    exists (
      select 1 from public.user_devotional_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );
create policy "answers_update_own" on public.user_devotional_answers
  for update using (
    exists (
      select 1 from public.user_devotional_entries e
      where e.id = entry_id and e.user_id = auth.uid()
    )
  );

create trigger answers_set_updated_at
  before update on public.user_devotional_answers
  for each row execute function public.set_updated_at();

-- Sorteia N perguntas ativas de uma categoria.
create or replace function public.pick_random_questions(cat text, n int)
returns uuid[]
language sql
stable
as $$
  select coalesce(array_agg(id), '{}')
  from (
    select id from public.devotional_questions
    where category = cat and active = true
    order by random()
    limit n
  ) q;
$$;

-- Ao criar uma nova entrada de devocional, sorteia as perguntas do dia
-- (só roda uma vez — não é acionado em updates, então o autosave não troca
-- as perguntas depois de sorteadas).
create or replace function public.handle_new_devotional_entry()
returns trigger
language plpgsql
as $$
begin
  if new.reflection_question_ids is null or array_length(new.reflection_question_ids, 1) is null then
    new.reflection_question_ids := public.pick_random_questions('reflexao', 3);
  end if;
  if new.application_question_ids is null or array_length(new.application_question_ids, 1) is null then
    new.application_question_ids := public.pick_random_questions('aplicacao', 2);
  end if;
  if new.prayer_question_ids is null or array_length(new.prayer_question_ids, 1) is null then
    new.prayer_question_ids := public.pick_random_questions('oracao', 3);
  end if;
  return new;
end;
$$;

create trigger before_insert_devotional_entry_pick_questions
  before insert on public.user_devotional_entries
  for each row execute function public.handle_new_devotional_entry();

-- Lote inicial de perguntas (baseado no levantamento da cliente).
insert into public.devotional_questions (category, question) values
('reflexao', 'O que este texto revela sobre Deus?'),
('reflexao', 'O que este texto revela sobre mim?'),
('reflexao', 'O que essa passagem me ensina sobre Deus?'),
('reflexao', 'O que ela me ensina sobre mim?'),
('reflexao', 'O que Deus pode estar querendo me ensinar hoje através desse texto?'),
('reflexao', 'O que Deus quer que eu compreenda hoje?'),
('reflexao', 'Existe algum pecado, atitude ou comportamento que preciso reconhecer?'),
('reflexao', 'Existe algo nessa passagem que confronta minha maneira de pensar ou agir?'),
('reflexao', 'O que preciso mudar a partir dessa reflexão?'),
('reflexao', 'O que Deus está me mostrando através dessa passagem?'),
('reflexao', 'Que aspecto da minha vida precisa ser transformado?'),
('reflexao', 'O que essa passagem despertou em mim?'),
('reflexao', 'O que eu ainda não havia percebido nesse texto?'),
('reflexao', 'Qual ensinamento quero levar comigo hoje?'),
('aplicacao', 'Como posso aplicar essa Palavra na minha vida hoje?'),
('aplicacao', 'O que preciso mudar?'),
('aplicacao', 'Existe algo que preciso abandonar, corrigir ou desenvolver?'),
('aplicacao', 'Qual atitude concreta vou tomar hoje?'),
('aplicacao', 'Como posso colocar esse ensinamento em prática hoje?'),
('oracao', 'O que preciso entregar a Deus hoje?'),
('oracao', 'Pelo que preciso pedir ajuda?'),
('oracao', 'Há alguma situação pela qual devo orar?'),
('oracao', 'Por quem devo orar hoje?');
