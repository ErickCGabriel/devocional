-- Uma entrada de devocional por usuário por dia é a chave natural (não o
-- devotional_id): quando o conteúdo do dia ainda não foi cadastrado, o app
-- reaproveita o devocional mais recente como fallback, e sem essa constraint
-- a entrada ficava "presa" ao mesmo devotional_id em vez de resetar a cada
-- entry_date novo.
alter table user_devotional_entries
  add constraint user_devotional_entries_user_date_key unique (user_id, entry_date);
