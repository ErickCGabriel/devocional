-- Marca de administrador — só quem tem is_admin=true acessa /admin. Não há
-- políticas de RLS especiais para admin: as rotas /admin usam o
-- service_role client (src/lib/supabase/service.ts), que ignora RLS, e o
-- gate de acesso é feito no servidor (src/lib/admin.ts) checando esta coluna
-- com o client normal (RLS) antes de qualquer operação privilegiada.
alter table profiles add column is_admin boolean not null default false;

update profiles set is_admin = true
where id = (select id from auth.users where email = 'erickcgabriel123@gmail.com');
