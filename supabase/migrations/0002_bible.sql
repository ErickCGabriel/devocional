-- Bíblia completa (Almeida 1911 — domínio público), pesquisável.
-- Fonte: João Ferreira de Almeida, Revista e Corrigida, edição de 1911.
-- Texto em domínio público — livre para uso, inclusive comercial.

create table public.bible_books (
  id smallint primary key,
  abbrev text not null unique,
  name text not null,
  testament text not null check (testament in ('AT', 'NT')),
  chapter_count smallint not null
);

alter table public.bible_books enable row level security;

create policy "bible_books_select_authenticated" on public.bible_books
  for select using (auth.role() = 'authenticated');

create table public.bible_verses (
  id bigint generated always as identity primary key,
  book_id smallint not null references public.bible_books(id) on delete cascade,
  chapter smallint not null,
  verse smallint not null,
  text text not null,
  unique (book_id, chapter, verse)
);

create index bible_verses_book_chapter_idx
  on public.bible_verses (book_id, chapter);

alter table public.bible_verses enable row level security;

create policy "bible_verses_select_authenticated" on public.bible_verses
  for select using (auth.role() = 'authenticated');

-- Busca por texto (favoritar/pesquisar passagens)
create index bible_verses_text_search_idx
  on public.bible_verses using gin (to_tsvector('portuguese', text));

-- Os 66 livros do cânon protestante, na ordem canônica.
-- Os versículos são importados separadamente — ver
-- supabase/scripts/import-bible.sql (depende de fetch HTTP externo).
insert into public.bible_books (id, abbrev, name, testament, chapter_count) values
(1, 'Gn', 'Gênesis', 'AT', 50),
(2, 'Êx', 'Êxodo', 'AT', 40),
(3, 'Lv', 'Levítico', 'AT', 27),
(4, 'Nm', 'Números', 'AT', 36),
(5, 'Dt', 'Deuteronômio', 'AT', 34),
(6, 'Js', 'Josué', 'AT', 24),
(7, 'Jz', 'Juízes', 'AT', 21),
(8, 'Rt', 'Rute', 'AT', 4),
(9, '1Sm', '1 Samuel', 'AT', 31),
(10, '2Sm', '2 Samuel', 'AT', 24),
(11, '1Rs', '1 Reis', 'AT', 22),
(12, '2Rs', '2 Reis', 'AT', 25),
(13, '1Cr', '1 Crônicas', 'AT', 29),
(14, '2Cr', '2 Crônicas', 'AT', 36),
(15, 'Ed', 'Esdras', 'AT', 10),
(16, 'Ne', 'Neemias', 'AT', 13),
(17, 'Et', 'Ester', 'AT', 10),
(18, 'Jó', 'Jó', 'AT', 42),
(19, 'Sl', 'Salmos', 'AT', 150),
(20, 'Pv', 'Provérbios', 'AT', 31),
(21, 'Ec', 'Eclesiastes', 'AT', 12),
(22, 'Ct', 'Cânticos', 'AT', 8),
(23, 'Is', 'Isaías', 'AT', 66),
(24, 'Jr', 'Jeremias', 'AT', 52),
(25, 'Lm', 'Lamentações', 'AT', 5),
(26, 'Ez', 'Ezequiel', 'AT', 48),
(27, 'Dn', 'Daniel', 'AT', 12),
(28, 'Os', 'Oséias', 'AT', 14),
(29, 'Jl', 'Joel', 'AT', 3),
(30, 'Am', 'Amós', 'AT', 9),
(31, 'Ob', 'Obadias', 'AT', 1),
(32, 'Jn', 'Jonas', 'AT', 4),
(33, 'Mq', 'Miquéias', 'AT', 7),
(34, 'Na', 'Naum', 'AT', 3),
(35, 'Hc', 'Habacuque', 'AT', 3),
(36, 'Sf', 'Sofonias', 'AT', 3),
(37, 'Ag', 'Ageu', 'AT', 2),
(38, 'Zc', 'Zacarias', 'AT', 14),
(39, 'Ml', 'Malaquias', 'AT', 4),
(40, 'Mt', 'Mateus', 'NT', 28),
(41, 'Mc', 'Marcos', 'NT', 16),
(42, 'Lc', 'Lucas', 'NT', 24),
(43, 'Jo', 'João', 'NT', 21),
(44, 'At', 'Atos', 'NT', 28),
(45, 'Rm', 'Romanos', 'NT', 16),
(46, '1Co', '1 Coríntios', 'NT', 16),
(47, '2Co', '2 Coríntios', 'NT', 13),
(48, 'Gl', 'Gálatas', 'NT', 6),
(49, 'Ef', 'Efésios', 'NT', 6),
(50, 'Fp', 'Filipenses', 'NT', 4),
(51, 'Cl', 'Colossenses', 'NT', 4),
(52, '1Ts', '1 Tessalonicenses', 'NT', 5),
(53, '2Ts', '2 Tessalonicenses', 'NT', 3),
(54, '1Tm', '1 Timóteo', 'NT', 6),
(55, '2Tm', '2 Timóteo', 'NT', 4),
(56, 'Tt', 'Tito', 'NT', 3),
(57, 'Fm', 'Filemom', 'NT', 1),
(58, 'Hb', 'Hebreus', 'NT', 13),
(59, 'Tg', 'Tiago', 'NT', 5),
(60, '1Pe', '1 Pedro', 'NT', 5),
(61, '2Pe', '2 Pedro', 'NT', 3),
(62, '1Jo', '1 João', 'NT', 5),
(63, '2Jo', '2 João', 'NT', 1),
(64, '3Jo', '3 João', 'NT', 1),
(65, 'Jd', 'Judas', 'NT', 1),
(66, 'Ap', 'Apocalipse', 'NT', 22);
