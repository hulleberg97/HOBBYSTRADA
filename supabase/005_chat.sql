-- HOBBYSTRADA – oppdatering 5: chat mellom kjøper og selger.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Én samtale per kjøper og annonse. Tittel og bilde lagres, så samtalen overlever at annonsen slettes.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_slug text not null,
  listing_title text not null,
  listing_image text,
  buyer_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  seller_name text not null,
  last_message text not null default '',
  last_sender_id uuid,
  last_message_at timestamptz not null default now(),
  buyer_read_at timestamptz not null default now(),
  seller_read_at timestamptz not null default 'epoch',
  created_at timestamptz not null default now(),
  unique (listing_slug, buyer_id)
);
create index if not exists conversations_buyer on public.conversations (buyer_id, last_message_at desc);
create index if not exists conversations_seller on public.conversations (seller_id, last_message_at desc);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  body text not null,
  offer numeric,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_conversation on public.chat_messages (conversation_id, created_at);

-- Bare serveren (service role) leser og skriver. Den sjekker at brukeren er med i samtalen.
alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;
grant all on public.conversations to service_role;
grant all on public.chat_messages to service_role;
