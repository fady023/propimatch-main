-- Propimatch Supabase schema (Postgres)
-- Run with: supabase db reset (dev) or supabase db push (migrations)

-- Extensions
create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type user_role as enum ('seeker', 'lister', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_type as enum ('sale', 'rent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_type as enum ('buy', 'rent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('open', 'matched', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type view_status as enum ('pending', 'confirmed', 'declined', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum ('match', 'message', 'appointment', 'credit', 'system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type txn_type as enum ('purchase', 'spend', 'refund');
exception when duplicate_object then null; end $$;

-- Profiles (mirror auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'seeker',
  name text,
  avatar_url text,
  phone text,
  credits integer not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(user_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute procedure public.handle_new_user();

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  type listing_type not null,
  title text not null,
  description text not null,
  price numeric not null,
  location text not null,
  bedrooms int not null,
  bathrooms int not null,
  area_sqft int not null,
  images text[] not null default '{}',
  amenities text[] not null default '{}',
  lat double precision,
  lng double precision,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists listings_type_idx on public.listings(type);
create index if not exists listings_location_idx on public.listings using gin(to_tsvector('simple', location));
create index if not exists listings_price_idx on public.listings(price);

-- Requests
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  type request_type not null,
  location text not null,
  budget numeric not null,
  bedrooms int,
  bathrooms int,
  amenities text[] not null default '{}',
  status request_status not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists requests_type_idx on public.requests(type);
create index if not exists requests_location_idx on public.requests using gin(to_tsvector('simple', location));

-- Matches (precomputed scores for fast sorting/filtering)
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  score int not null,
  shortlisted boolean not null default false,
  discarded boolean not null default false,
  status text,
  created_at timestamptz not null default now(),
  unique (request_id, listing_id)
);
create index if not exists matches_request_score_idx on public.matches(request_id, score desc);
create index if not exists matches_listing_idx on public.matches(listing_id);

-- Listing actions (per-user shortlist/discard)
create table if not exists public.listing_actions (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  shortlisted boolean not null default false,
  discarded boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key(user_id, listing_id)
);

-- Conversations and messages
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(user_id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

create or replace function public.bump_conversation_updated()
returns trigger language plpgsql as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end; $$;

drop trigger if exists trg_bump_conversation on public.messages;
create trigger trg_bump_conversation after insert on public.messages
for each row execute procedure public.bump_conversation_updated();

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

-- Wallet transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  type txn_type not null,
  amount int not null,
  description text,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_idx on public.transactions(user_id, created_at desc);

-- Viewing requests
create table if not exists public.viewing_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  requester_id uuid not null references public.profiles(user_id) on delete cascade,
  scheduled_at timestamptz not null,
  note text,
  status view_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists viewing_by_listing_idx on public.viewing_requests(listing_id, scheduled_at desc);

-- Admin actions log
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(user_id) on delete set null,
  action text not null,
  target_id uuid,
  listing_id uuid references public.listings(id) on delete set null,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.requests enable row level security;
alter table public.matches enable row level security;
alter table public.listing_actions enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.transactions enable row level security;
alter table public.viewing_requests enable row level security;
alter table public.admin_logs enable row level security;

-- Profiles: anyone can select minimal fields; users can update their own
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles for select using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = user_id);

-- Listings: public can read approved; owners can read/write their own
drop policy if exists listings_select_public on public.listings;
create policy listings_select_public on public.listings for select using (approved or auth.uid() = user_id);

drop policy if exists listings_modify_own on public.listings;
create policy listings_modify_own on public.listings using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Requests: owner-only
drop policy if exists requests_owner_rw on public.requests;
create policy requests_owner_rw on public.requests using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Matches: visible to request owner or listing owner; only system/edge updates allowed (restrict writes)
drop policy if exists matches_select on public.matches;
create policy matches_select on public.matches for select using (
  exists (select 1 from public.requests r where r.id = request_id and r.user_id = auth.uid())
  or exists (select 1 from public.listings l where l.id = listing_id and l.user_id = auth.uid())
);

-- Listing actions: owner-only
drop policy if exists listing_actions_rw on public.listing_actions;
create policy listing_actions_rw on public.listing_actions using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Conversations: participants only
drop policy if exists conversations_participant_select on public.conversations;
create policy conversations_participant_select on public.conversations for select using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = id and p.user_id = auth.uid())
);

drop policy if exists conv_participants_rw on public.conversation_participants;
create policy conv_participants_rw on public.conversation_participants using (
  user_id = auth.uid()
) with check (user_id = auth.uid());

drop policy if exists messages_participant_rw on public.messages;
create policy messages_participant_rw on public.messages using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = conversation_id and p.user_id = auth.uid())
) with check (
  sender_id = auth.uid()
  and exists (select 1 from public.conversation_participants p where p.conversation_id = conversation_id and p.user_id = auth.uid())
);

-- Notifications: owner-only
drop policy if exists notifications_owner_rw on public.notifications;
create policy notifications_owner_rw on public.notifications using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Transactions: owner-only select; inserts via webhooks/edge functions
drop policy if exists transactions_owner_select on public.transactions;
create policy transactions_owner_select on public.transactions for select using (auth.uid() = user_id);

-- Viewing requests: requester or listing owner can read; requester can insert own
drop policy if exists view_requests_select on public.viewing_requests;
create policy view_requests_select on public.viewing_requests for select using (
  requester_id = auth.uid() or exists (select 1 from public.listings l where l.id = listing_id and l.user_id = auth.uid())
);

drop policy if exists view_requests_insert on public.viewing_requests;
create policy view_requests_insert on public.viewing_requests for insert with check (requester_id = auth.uid());

-- Admin logs: admin-only select (example; adapt to your role management)
drop policy if exists admin_logs_select on public.admin_logs;
create policy admin_logs_select on public.admin_logs for select using (
  exists (select 1 from public.profiles pr where pr.user_id = auth.uid() and pr.role = 'admin')
);

-- Done


