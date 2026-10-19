-- Bilder i chatten. Bildene ligger i en privat bøtte og vises bare via tidsbegrensede lenker til de to i samtalen.
alter table public.chat_messages add column if not exists image text;
insert into storage.buckets (id, name, public) values ('chat-images', 'chat-images', false)
on conflict (id) do nothing;
