-- website_requests: stores "build my website" order submissions from the Tajer service landing page.
-- Run this once in the Supabase Dashboard -> SQL Editor for the tagershop project.

create table if not exists public.website_requests (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_type text not null check (business_type in ('fashion','restaurant','other')),
  contact_name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.website_requests enable row level security;

-- The server API route uses the service role key, which bypasses RLS.
-- These policies only gate anon/authenticated browser calls; the server can always write.
create policy "anon can submit website requests"
  on public.website_requests for insert
  to anon, authenticated
  with check (true);
