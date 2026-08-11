-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- Backs the local-only /admin CMS: ticker image list/order, and the hero text.

create table if not exists public.ticker_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ticker_images enable row level security;

-- Single row (id is always 1) holding the editable hero copy.
create table if not exists public.site_content (
  id integer primary key default 1,
  headline text not null default 'Join the waitlist!',
  body text not null default 'Foldrise helps clothing brands create premium model photos without the cost and effort of a traditional photoshoot.',
  button_label text not null default 'Get early access',
  footer_note text not null default 'We will only email you about the Foldrise launch.',
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

insert into public.site_content (id) values (1)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

-- Public bucket so ticker images are viewable via their public URL on the live
-- site without any auth. Uploads/deletes go through the admin API routes
-- using the service role key, which bypasses RLS/storage policies entirely —
-- the anon/public key never gets write access.
insert into storage.buckets (id, name, public)
values ('ticker-images', 'ticker-images', true)
on conflict (id) do nothing;
