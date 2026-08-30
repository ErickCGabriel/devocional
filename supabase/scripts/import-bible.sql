-- Importa a Bíblia Almeida 1911 (domínio público) para public.bible_verses.
--
-- Pré-requisito: rodar as migrations 0001_init.sql e 0002_bible.sql antes
-- (precisa das tabelas public.bible_books já populadas — ver
-- supabase/seed-bible-books.sql — e public.bible_verses vazia).
--
-- Como rodar: cole este script no SQL Editor do painel Supabase do projeto,
-- ou via `mcp__Supabase__execute_sql` / Supabase CLI (`supabase db execute`).
-- Não faz parte das migrations numeradas porque depende de um fetch HTTP
-- externo no momento da execução.
--
-- Fonte dos dados: https://github.com/damarals/biblias (Almeida 1911,
-- marcada como domínio público pelo mantenedor — "podem ser redistribuídas
-- livremente"). Formato: um array de 66 livros, cada um com `abbrev` e
-- `chapters` (array de arrays de strings, uma por versículo).

create extension if not exists http;

do $$
declare
  resp http_response;
  bible jsonb;
  book_json jsonb;
  chap_json jsonb;
  vtext text;
  b_id smallint;
  c_idx int;
  v_idx int;
begin
  resp := http_get('https://github.com/damarals/biblias/releases/latest/download/ALM1911.json');

  if resp.status != 200 then
    raise exception 'Falha ao baixar o JSON da Bíblia: HTTP %', resp.status;
  end if;

  bible := resp.content::jsonb;

  for book_json in select * from jsonb_array_elements(bible)
  loop
    select id into b_id from public.bible_books where abbrev = book_json->>'abbrev';
    if b_id is null then
      raise notice 'Livro não encontrado em bible_books: %', book_json->>'abbrev';
      continue;
    end if;

    c_idx := 0;
    for chap_json in select * from jsonb_array_elements(book_json->'chapters')
    loop
      c_idx := c_idx + 1;
      v_idx := 0;
      for vtext in select * from jsonb_array_elements_text(chap_json)
      loop
        v_idx := v_idx + 1;
        insert into public.bible_verses (book_id, chapter, verse, text)
        values (b_id, c_idx, v_idx, vtext)
        on conflict (book_id, chapter, verse) do nothing;
      end loop;
    end loop;
  end loop;
end $$;

drop extension if exists http;
