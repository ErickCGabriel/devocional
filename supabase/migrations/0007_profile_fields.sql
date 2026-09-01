-- ---------------------------------------------------------------------------
-- Campos adicionais de cadastro: idade, gênero, religião, objetivo no app.
-- Preenchidos no cadastro (signUp options.data), lidos por handle_new_user().
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column idade smallint check (idade between 1 and 120),
  add column genero text check (genero in ('feminino', 'masculino', 'prefiro_nao_dizer')),
  add column religiao text check (
    religiao in (
      'catolico', 'evangelico', 'espirita', 'outra_crista',
      'outra_religiao', 'sem_religiao', 'prefiro_nao_dizer'
    )
  ),
  add column objetivo text check (
    objetivo in ('habito_diario', 'crescer_na_fe', 'estudar_biblia', 'momento_dificil')
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_genero text := new.raw_user_meta_data ->> 'genero';
begin
  insert into public.profiles (id, full_name, idade, genero, religiao, objetivo, theme)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    nullif(new.raw_user_meta_data ->> 'idade', '')::smallint,
    meta_genero,
    new.raw_user_meta_data ->> 'religiao',
    new.raw_user_meta_data ->> 'objetivo',
    case when meta_genero = 'masculino' then 'masculino' else 'feminino' end
  );

  insert into public.streaks (user_id) values (new.id);

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$;
