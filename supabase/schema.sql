-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row Level Security stays enabled with no public policies.
-- All inserts go through the server-side API route using the service role key,
-- which bypasses RLS — the anon/public key never touches this table.
alter table public.waitlist enable row level security;
