-- HOBBYSTRADA – databaseoppsett for Supabase.
-- Kjør hele filen én gang i Supabase: SQL Editor → New query → lim inn → Run.

create extension if not exists pgcrypto;

-- Annonser
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  player text not null,
  set_name text,
  season text,
  card_number text,
  numbered text,
  producer text not null default 'Topps',
  types text[] not null default '{}',
  tag text not null default 'Annet',
  club text,
  league text,
  grading text,
  condition text,
  description text not null default '',
  price numeric(10,2) not null check (price > 0),
  featured_until timestamptz,
  bumped_until timestamptz,
  frontpage_until timestamptz,
  images text[] not null default '{}',
  seller_name text not null,
  location text,
  owner_id uuid references auth.users(id) on delete set null,
  contact_name text,
  contact_email text,
  contact_phone text,
  status text not null default 'pending' check (status in ('pending','active','sold','hidden','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists listings_status_idx on public.listings (status, created_at desc);
create index if not exists listings_owner_idx on public.listings (owner_id);

-- Meldinger fra kjøpere til selgere
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_slug text not null,
  seller_id uuid references auth.users(id) on delete cascade,
  sender_name text not null,
  sender_email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Kontaktskjema
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  body text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- Bestillinger av annonseløft
create table if not exists public.boost_orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  buyer_email text,
  plan text not null check (plan in ('top','featured','frontpage')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- Tilganger: serveren (service_role) får alt. Virker også når «Automatically expose new tables» er slått av.
grant usage on schema public to anon, authenticated, service_role;
grant all on public.listings, public.messages, public.contact_messages, public.boost_orders to service_role;

-- Sikkerhet: alle kan lese aktive og solgte annonser, men bare uten kontaktinformasjon.
-- Alt annet går gjennom serveren med service-nøkkelen.
alter table public.listings enable row level security;
alter table public.messages enable row level security;
alter table public.contact_messages enable row level security;
alter table public.boost_orders enable row level security;

drop policy if exists "Offentlige annonser" on public.listings;
create policy "Offentlige annonser" on public.listings for select using (status in ('active','sold'));

revoke select on public.listings from anon, authenticated;
grant select (id, slug, title, player, set_name, season, card_number, numbered, producer, types, tag, club, league,
  grading, condition, description, price, featured_until, bumped_until, frontpage_until, images, seller_name, location,
  owner_id, status, created_at, updated_at) on public.listings to anon, authenticated;

-- Lagrede søk («Varsle meg om nye kort»)
create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  query text not null,
  label text not null,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists saved_searches_user_idx on public.saved_searches (user_id);
alter table public.saved_searches enable row level security;
grant all on public.saved_searches to service_role;

-- Prisarkiv: når kortet ble solgt
alter table public.listings add column if not exists sold_at timestamptz;
grant select (sold_at) on public.listings to anon, authenticated;
update public.listings set sold_at = updated_at where status = 'sold' and sold_at is null;

-- Rapporterte annonser
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_slug text not null,
  reason text not null,
  details text not null default '',
  reporter_email text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
grant all on public.reports to service_role;

-- Når kunden samtykket i at løftet starter straks (og angreretten faller bort)
alter table public.boost_orders add column if not exists consent_at timestamptz;

-- Bekreftet identitet fra Vipps, én rad per bruker
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  vipps_sub text unique,
  verified_name text,
  phone text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
grant all on public.profiles to service_role;

-- Merke på annonsen: selgeren er verifisert med Vipps
alter table public.listings add column if not exists seller_verified boolean not null default false;
grant select (seller_verified) on public.listings to anon, authenticated;

-- Bilder
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Annonsene fra den gamle butikken
insert into public.listings (slug, title, player, set_name, season, card_number, numbered, producer, types, tag, club, league,
  grading, condition, description, price, featured_until, bumped_until, images, seller_name, location, created_at, status)
values
('sam-kerr-topps-inception-silver-signings-autograf-ssav-sk', 'Sam Kerr – Topps Inception Silver Signings Autograf (SSAV-SK)', 'Sam Kerr', 'Topps Inception Silver Signings Autograf', '2024/25', 'SSAV-SK', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Chelsea', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Inception 2024/25, Silver Signings-autograf SSAV-SK.

Ugradert (raw), tilstand Near Mint / Mint.', 1099, now() + interval '7 days', now() + interval '3 days', '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T21:00:00+00:00', 'active'),
('lionel-messi-topps-chrome-ucc-shadow-etch-se-18', 'Lionel Messi – Topps Chrome UCC Shadow Etch (SE-18)', 'Lionel Messi', 'Topps Chrome UCC Shadow Etch', '2025/26', 'SE-18', null, 'Topps', array['Base']::text[], 'Base', 'FC Barcelona', 'LaLiga', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, innstikk Shadow Etch SE-18.

Ugradert (raw), tilstand Near Mint / Mint.', 2999, now() + interval '7 days', now() + interval '3 days', '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:59:00+00:00', 'active'),
('ronaldinho-topps-chrome-ucc-autograf-0125', 'Ronaldinho – Topps Chrome UCC Autograf (01/25)', 'Ronaldinho', 'Topps Chrome UCC Autograf', null, '01/25', '01/25', 'Topps', array['Autograf','Nummerert']::text[], 'Autograf', null, null, null, null, 'FC Barcelona. Topps Chrome UEFA Club Competitions, autografkort nummerert 01/25.

Selger: Halvor Ulleberg.', 15000, null, null, array['/img/ronaldinho-0125.jpeg']::text[], 'HOBBYSTRADA', null, '2026-10-16T22:58:00+00:00', 'active'),
('mohamed-salah-topps-museum-collection-ucc-patch-176199', 'Mohamed Salah – Topps Museum Collection UCC Patch (176/199)', 'Mohamed Salah', 'Topps Museum Collection UCC Patch', '2024/25', '176/199', '176/199', 'Topps', array['Patch','Nummerert']::text[], 'Patch', 'Liverpool FC', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Museum Collection UEFA Club Competitions 2024/25, nummerert patch/relic-kort 176/199.

Ugradert (raw), tilstand Near Mint / Mint.', 499, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:57:00+00:00', 'active'),
('sergio-aguero-topps-chrome-king-autograph-cka-sa', 'Sergio Agüero – Topps Chrome King Autograph (CKA-SA)', 'Sergio Agüero', 'Topps Chrome King Autograph', '2025/26', 'CKA-SA', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Manchester City FC', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome 2025/26, King Autograph CKA-SA.

Ugradert (raw), tilstand Near Mint / Mint.', 850, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:56:00+00:00', 'active'),
('heung-min-son-topps-inception-ucc-31', 'Heung-Min Son – Topps Inception UCC (#31)', 'Heung-Min Son', 'Topps Inception UCC', '2024/25', '#31', null, 'Topps', array['Base']::text[], 'Base', 'Tottenham Hotspur', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Inception UEFA Club Competitions 2024/25, kort nr. 31.

Ugradert (raw), tilstand Near Mint / Mint.', 700, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:55:00+00:00', 'active'),
('donyell-malen-topps-chrome-ucc-autograf-ca-dm', 'Donyell Malen – Topps Chrome UCC Autograf (CA-DM)', 'Donyell Malen', 'Topps Chrome UCC Autograf', '2025/26', 'CA-DM', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Aston Villa', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CA-DM.

Ugradert (raw), tilstand Near Mint / Mint.', 225, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:54:00+00:00', 'active'),
('samuel-etoo-topps-chrome-ucc-autograf-cla-se-raw', 'Samuel Eto''o – Topps Chrome UCC Autograf (CLA-SE)', 'Samuel Eto''o', 'Topps Chrome UCC Autograf', null, 'CLA-SE', null, 'Topps', array['Autograf']::text[], 'Autograf', 'FC Internazionale Milano', 'Serie A', 'Ugradert (raw)', null, 'Topps Chrome UEFA Club Competitions, autografkort CLA-SE.

Ugradert (raw).', 500, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:53:00+00:00', 'active'),
('mohamed-salah-topps-museum-collection-ucc-triple-relic-sptr-ms', 'Mohamed Salah – Topps Museum Collection UCC Triple Relic (SPTR-MS)', 'Mohamed Salah', 'Topps Museum Collection UCC Triple Relic', '2024/25', 'SPTR-MS', null, 'Topps', array['Relic']::text[], 'Relic', 'Liverpool FC', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Museum Collection UEFA Club Competitions 2024/25, triple relic-kort SPTR-MS.

Ugradert (raw), tilstand Near Mint / Mint.', 850, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:52:00+00:00', 'active'),
('joshua-kimmich-topps-chrome-ucc-autograf-ca-ki', 'Joshua Kimmich – Topps Chrome UCC Autograf (CA-KI)', 'Joshua Kimmich', 'Topps Chrome UCC Autograf', '2025/26', 'CA-KI', null, 'Topps', array['Autograf']::text[], 'Autograf', 'FC Bayern München', 'Bundesliga', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CA-KI.

Ugradert (raw), tilstand Near Mint / Mint.', 250, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:51:00+00:00', 'active'),
('paolo-maldini-topps-chrome-ucc-black-lazer-autograf-bla-pm', 'Paolo Maldini – Topps Chrome UCC Black Lazer Autograf (BLA-PM)', 'Paolo Maldini', 'Topps Chrome UCC Black Lazer Autograf', '2025/26', 'BLA-PM', null, 'Topps', array['Autograf']::text[], 'Autograf', 'AC Milan', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, Black Lazer-autograf BLA-PM.

Ugradert (raw), tilstand Near Mint / Mint.', 950, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:50:00+00:00', 'active'),
('samuel-etoo-topps-chrome-ucc-autograf-cla-se', 'Samuel Eto''o – Topps Chrome UCC Autograf (CLA-SE)', 'Samuel Eto''o', 'Topps Chrome UCC Autograf', '2025/26', 'CLA-SE', null, 'Topps', array['Autograf']::text[], 'Autograf', 'FC Internazionale Milano', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CLA-SE.

Ugradert (raw), tilstand Near Mint / Mint.', 650, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:49:00+00:00', 'active'),
('david-silva-topps-museum-collection-ucc-autograf-mma-ds', 'David Silva – Topps Museum Collection UCC Autograf (MMA-DS)', 'David Silva', 'Topps Museum Collection UCC Autograf', '2024/25', 'MMA-DS', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Manchester City FC', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Museum Collection UEFA Club Competitions 2024/25, autografkort MMA-DS.

Ugradert (raw), tilstand Near Mint / Mint.', 675, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:48:00+00:00', 'active'),
('geovany-quenda-topps-museum-collection-ucc-autograf-patch-rc', 'Geovany Quenda – Topps Museum Collection UCC Autograf Patch RC', 'Geovany Quenda', 'Topps Museum Collection UCC Autograf Patch RC', '2024/25', null, null, 'Topps', array['Autograf','Patch','Rookie']::text[], 'Autograf', 'Sporting CP', 'Liga Portugal', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Museum Collection UEFA Club Competitions 2024/25, rookie-kort med autograf og patch.

Ugradert (raw), tilstand Near Mint / Mint.', 999, now() + interval '7 days', null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:47:00+00:00', 'active'),
('paul-scholes-topps-chrome-ucc-road-to-glory-autograf-rtg-ps', 'Paul Scholes – Topps Chrome UCC Road To Glory Autograf (RTG-PS)', 'Paul Scholes', 'Topps Chrome UCC Road To Glory Autograf', '2025/26', 'RTG-PS', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Manchester United', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort Road To Glory RTG-PS.

Ugradert (raw), tilstand Near Mint / Mint.', 1500, now() + interval '7 days', null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:46:00+00:00', 'active'),
('santi-cazorla-topps-chrome-ucc-black-lazer-autograf-bla-sc', 'Santi Cazorla – Topps Chrome UCC Black Lazer Autograf (BLA-SC)', 'Santi Cazorla', 'Topps Chrome UCC Black Lazer Autograf', '2025/26', 'BLA-SC', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Arsenal', 'Premier League', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, Black Lazer-autograf BLA-SC.

Ugradert (raw), tilstand Near Mint / Mint.', 450, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:45:00+00:00', 'active'),
('patrice-evra-topps-deco-autograf-8899', 'Patrice Evra – Topps DECO Autograf (88/99)', 'Patrice Evra', 'Topps DECO Autograf', '2025/26', '88/99', '88/99', 'Topps', array['Autograf','Nummerert']::text[], 'Autograf', 'AS Monaco', 'Ligue 1', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps DECO 2025/26, nummerert autografkort 88/99.

Ugradert (raw), tilstand Near Mint / Mint.', 379, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:44:00+00:00', 'active'),
('ronaldinho-topps-chrome-ucc-last-dance-ld-9', 'Ronaldinho – Topps Chrome UCC Last Dance (LD-9)', 'Ronaldinho', 'Topps Chrome UCC Last Dance', '2025/26', 'LD-9', null, 'Topps', array['Base']::text[], 'Base', 'AC Milan', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, innstikk Last Dance LD-9.

Ugradert (raw), tilstand Near Mint / Mint.', 700, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:43:00+00:00', 'active'),
('eduardo-camavinga-topps-chrome-ucc-18', 'Eduardo Camavinga – Topps Chrome UCC (#18)', 'Eduardo Camavinga', 'Topps Chrome UCC', '2025/26', '#18', null, 'Topps', array['Base']::text[], 'Base', 'Real Madrid CF', 'LaLiga', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, kort nr. 18.

Ugradert (raw), tilstand Near Mint / Mint.', 250, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:42:00+00:00', 'active'),
('bastian-schweinsteiger-topps-chrome-ucc-black-lazer-autograf-bla-bs', 'Bastian Schweinsteiger – Topps Chrome UCC Black Lazer Autograf (BLA-BS)', 'Bastian Schweinsteiger', 'Topps Chrome UCC Black Lazer Autograf', '2025/26', 'BLA-BS', null, 'Topps', array['Autograf']::text[], 'Autograf', 'FC Bayern München', 'Bundesliga', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, Black Lazer-autograf BLA-BS.

Ugradert (raw), tilstand Near Mint / Mint.', 550, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:41:00+00:00', 'active'),
('rasmus-hjlund-topps-chrome-ucc-autograf-ca-rh', 'Rasmus Højlund – Topps Chrome UCC Autograf (CA-RH)', 'Rasmus Højlund', 'Topps Chrome UCC Autograf', '2025/26', 'CA-RH', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Napoli', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CA-RH.

Ugradert (raw), tilstand Near Mint / Mint.', 200, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:40:00+00:00', 'active'),
('romelu-lukaku-topps-chrome-ucc-power-players-pp-12', 'Romelu Lukaku – Topps Chrome UCC Power Players (PP-12)', 'Romelu Lukaku', 'Topps Chrome UCC Power Players', '2025/26', 'PP-12', null, 'Topps', array['Base']::text[], 'Base', 'Napoli', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, innstikk Power Players PP-12.

Ugradert (raw), tilstand Near Mint / Mint.', 900, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:39:00+00:00', 'active'),
('alessandro-bastoni-topps-chrome-ucc-autograf-ca-ab', 'Alessandro Bastoni – Topps Chrome UCC Autograf (CA-AB)', 'Alessandro Bastoni', 'Topps Chrome UCC Autograf', '2025/26', 'CA-AB', null, 'Topps', array['Autograf']::text[], 'Autograf', 'FC Internazionale Milano', 'Serie A', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CA-AB.

Ugradert (raw), tilstand Near Mint / Mint.', 200, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:38:00+00:00', 'active'),
('nuno-mendes-topps-chrome-ucc-autograf-ca-nm', 'Nuno Mendes – Topps Chrome UCC Autograf (CA-NM)', 'Nuno Mendes', 'Topps Chrome UCC Autograf', '2025/26', 'CA-NM', null, 'Topps', array['Autograf']::text[], 'Autograf', 'Paris Saint-Germain', 'Ligue 1', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, autografkort CA-NM.

Ugradert (raw), tilstand Near Mint / Mint.', 300, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:37:00+00:00', 'active'),
('desire-doue-topps-chrome-ucc-198', 'Désiré Doué – Topps Chrome UCC (#198)', 'Désiré Doué', 'Topps Chrome UCC', '2025/26', '#198', null, 'Topps', array['Base']::text[], 'Base', 'Paris Saint-Germain', 'Ligue 1', 'Ugradert (raw)', 'Near Mint / Mint', 'Topps Chrome UEFA Club Competitions 2025/26, kort nr. 198.

Ugradert (raw), tilstand Near Mint / Mint.', 850, null, null, '{}'::text[], 'HOBBYSTRADA', null, '2026-10-16T20:36:00+00:00', 'active')
on conflict (slug) do nothing;
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
-- HOBBYSTRADA – oppdatering 6: fest kort til kortvifta på forsiden.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Plass i vifta: 1 = midten, 2 = venstre, 3 = høyre, 4 = ytterst venstre, 5 = ytterst høyre
alter table public.listings add column if not exists fan_slot smallint check (fan_slot between 1 and 5);
create unique index if not exists listings_fan_slot on public.listings (fan_slot) where fan_slot is not null;
grant select (fan_slot) on public.listings to anon, authenticated;
-- HOBBYSTRADA – oppdatering 7: grenser mot spam, og sanntid i chatten.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Teller handlinger per bruker/IP, så vi kan stoppe spam (ryddes daglig)
create table if not exists public.rate_events (
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_events_key_time on public.rate_events (key, created_at desc);
alter table public.rate_events enable row level security;
grant all on public.rate_events to service_role;

-- Sanntid: innloggede brukere kan lese sine egne samtaler og meldinger (og ingen andres)
grant select on public.conversations to authenticated;
grant select on public.chat_messages to authenticated;
drop policy if exists "Egne samtaler" on public.conversations;
create policy "Egne samtaler" on public.conversations for select to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
drop policy if exists "Meldinger i egne samtaler" on public.chat_messages;
create policy "Meldinger i egne samtaler" on public.chat_messages for select to authenticated
  using (exists (select 1 from public.conversations c where c.id = conversation_id and (auth.uid() = c.buyer_id or auth.uid() = c.seller_id)));
do $$ begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null; end $$;

-- Bilder i chatten. Bildene ligger i en privat bøtte og vises bare via tidsbegrensede lenker til de to i samtalen.
alter table public.chat_messages add column if not exists image text;
insert into storage.buckets (id, name, public) values ('chat-images', 'chat-images', false)
on conflict (id) do nothing;

-- Betalinger beholdes når annonsen slettes (supabase/009_betalinger_personvern.sql)
alter table public.boost_orders add column if not exists listing_title text;
alter table public.boost_orders alter column listing_id drop not null;
alter table public.boost_orders drop constraint if exists boost_orders_listing_id_fkey;
alter table public.boost_orders add constraint boost_orders_listing_id_fkey
  foreign key (listing_id) references public.listings(id) on delete set null;
