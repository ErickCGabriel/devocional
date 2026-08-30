-- ---------------------------------------------------------------------------
-- figurinhas — decoração opcional anexada à entrada do devocional do dia
-- ---------------------------------------------------------------------------
alter table public.user_devotional_entries
  add column sticker_key text;
