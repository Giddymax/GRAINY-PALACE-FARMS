-- Farm locations page: table, access policies, and grants.
-- Run this after supabase/schema.sql has initialized public.is_staff() and
-- public.set_updated_at(). Safe to rerun; existing rows are preserved.

create table if not exists public.farm_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  locality text not null,
  address text,
  description text,
  latitude numeric(10, 7) not null check (latitude >= -90 and latitude <= 90),
  longitude numeric(10, 7) not null check (longitude >= -180 and longitude <= 180),
  map_url text,
  route_notes text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_farm_locations_public_order
  on public.farm_locations (is_published, region, sort_order);

drop trigger if exists trg_farm_locations_updated_at on public.farm_locations;
create trigger trg_farm_locations_updated_at before update on public.farm_locations
  for each row execute function public.set_updated_at();

alter table public.farm_locations enable row level security;

drop policy if exists "farm_locations_public_select" on public.farm_locations;
create policy "farm_locations_public_select" on public.farm_locations for select
  to anon, authenticated
  using (is_published = true or (select public.is_staff()));

drop policy if exists "farm_locations_staff_write" on public.farm_locations;
create policy "farm_locations_staff_write" on public.farm_locations for all
  to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

grant select on public.farm_locations to anon, authenticated;
grant insert, update, delete on public.farm_locations to authenticated;
grant all on public.farm_locations to service_role;
