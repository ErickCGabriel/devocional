-- Reestrutura os temas visuais: "Feminino" (rosa/mauve) e "Masculino"
-- (preto/branco/cinza) são os 2 temas gratuitos. 4 slots reservados para
-- temas exclusivos do plano premium (desenho visual a definir depois).

alter table public.profiles
  drop constraint profiles_theme_check;

update public.profiles set theme = 'feminino' where theme in ('padrao', 'sepia');
update public.profiles set theme = 'masculino' where theme = 'escuro';

alter table public.profiles
  alter column theme set default 'feminino';

alter table public.profiles
  add constraint profiles_theme_check
  check (theme in ('feminino', 'masculino', 'premium_1', 'premium_2', 'premium_3', 'premium_4'));
