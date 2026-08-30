-- Conteúdo de exemplo para desenvolvimento local.
-- Não é aplicado automaticamente em produção — use `supabase db reset` localmente
-- ou rode manualmente via SQL editor do painel Supabase.

insert into public.devotionals
  (devotional_date, title, verse_reference, verse_text, reading, reflection_prompt, application_prompt, prayer_prompt)
values
  (
    current_date,
    'Confiança em tempos de incerteza',
    'Provérbios 3:5-6',
    'Confie no Senhor de todo o coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.',
    'Leia Provérbios 3:1-12 e reflita sobre o que significa confiar em Deus mesmo quando não entendemos completamente o caminho à frente.',
    'Em que áreas da sua vida você tem confiado mais no seu próprio entendimento do que em Deus?',
    'Escolha uma decisão que você está enfrentando esta semana e entregue-a a Deus em oração.',
    'Peça a Deus sabedoria e coragem para confiar nEle mesmo quando o caminho não está claro.'
  ),
  (
    current_date - 1,
    'A paz que excede todo entendimento',
    'Filipenses 4:6-7',
    'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.',
    'Leia Filipenses 4:4-9 e observe a conexão entre oração, gratidão e paz.',
    'O que tem causado ansiedade na sua vida ultimamente?',
    'Pratique hoje trocar uma preocupação específica por uma oração de gratidão.',
    'Agradeça a Deus por três coisas específicas antes de apresentar seus pedidos.'
  )
on conflict (devotional_date) do nothing;

insert into public.weekly_verses (week_start, verse_reference, verse_text, reflection)
values (
  date_trunc('week', current_date)::date,
  'Salmos 46:10',
  'Aquietem-se, e saibam que eu sou Deus.',
  'Nesta semana, reserve momentos de silêncio para reconhecer a soberania de Deus sobre todas as circunstâncias.'
)
on conflict (week_start) do nothing;

insert into public.reading_plans (slug, title, description, total_days, is_premium)
values
  ('evangelho-de-joao', 'Evangelho de João em 21 dias', 'Uma jornada pelo evangelho de João, capítulo por capítulo.', 21, false),
  ('biblia-em-1-ano', 'Bíblia em 1 ano', 'Leitura completa da Bíblia em 365 dias, com Antigo e Novo Testamento intercalados.', 365, true),
  ('salmos-de-confianca', 'Salmos de Confiança', '14 dias meditando em salmos que fortalecem a fé.', 14, true)
on conflict (slug) do nothing;

insert into public.reading_plan_days (plan_id, day_number, title, passage_reference, content)
select id, 1, 'O Verbo se fez carne', 'João 1:1-18', 'Reflita sobre a divindade de Cristo revelada logo no início do evangelho.'
from public.reading_plans where slug = 'evangelho-de-joao'
on conflict (plan_id, day_number) do nothing;

insert into public.reading_plan_days (plan_id, day_number, title, passage_reference, content)
select id, 2, 'O testemunho de João Batista', 'João 1:19-34', 'João Batista aponta para Jesus como o Cordeiro de Deus.'
from public.reading_plans where slug = 'evangelho-de-joao'
on conflict (plan_id, day_number) do nothing;
