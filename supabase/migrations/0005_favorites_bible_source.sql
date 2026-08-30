-- Permite favoritar versículos direto da tela de leitura da Bíblia.
alter table public.favorites
  drop constraint favorites_source_check;

alter table public.favorites
  add constraint favorites_source_check
  check (source in ('devocional', 'plano', 'manual', 'biblia'));

-- source_id passa a poder referenciar bible_verses.id (bigint) também —
-- guardamos como texto para não acoplar a coluna a um único tipo de FK.
alter table public.favorites
  alter column source_id type text using source_id::text;
