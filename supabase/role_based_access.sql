-- Role-based access setup for an existing Grainy Palace Farms Supabase project.
-- Run in Supabase Dashboard > SQL Editor after supabase/schema.sql has been
-- applied. Roles live in public.profiles, linked to Authentication users by id.
-- Never read a role from user-editable auth user_metadata.

begin;

alter table public.profiles
  add column if not exists role text not null default 'customer',
  add column if not exists is_active boolean not null default true;

-- Ensure existing email-based Auth users have a linked customer profile before
-- roles are assigned. Never take an admin/staff role from Auth user metadata.
insert into public.profiles (id, email, full_name)
select u.id, u.email, u.raw_user_meta_data ->> 'full_name'
from auth.users u
where u.email is not null
on conflict (id) do nothing;

-- Normalize legacy values before enforcing the supported roles.
update public.profiles
set role = 'customer'
where role is null or role not in ('admin', 'staff', 'partner', 'customer');

alter table public.profiles
  alter column role set default 'customer',
  alter column role set not null,
  alter column is_active set default true,
  alter column is_active set not null;

-- Replace any older role check so both admin and staff are valid assignments.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.profiles drop constraint %I', constraint_name);
  end loop;
end;
$$;

alter table public.profiles
  add constraint profiles_role_allowed_check
  check (role in ('admin', 'staff', 'partner', 'customer'));

create or replace function public.is_staff()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff')
      and is_active = true
  );
end;
$$;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
end;
$$;

create or replace function public.is_approved_partner()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.partners p
    join public.profiles pr on pr.id = p.profile_id
    where p.profile_id = auth.uid()
      and p.approved = true
      and pr.is_active = true
  );
end;
$$;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
    -- SQL editor/service-role actions have no authenticated uid. Signed-in
    -- admins may manage other users but cannot alter their own privileges.
    if auth.uid() is not null and (new.id = auth.uid() or not public.is_admin()) then
      raise exception 'Only admins can change another user role or active status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileges on public.profiles;
create trigger trg_protect_profile_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- New signups become customers regardless of submitted Auth metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

commit;

-- Bootstrap the first administrator after their account has been created in
-- Supabase Authentication. Replace the email and run this separately:
-- update public.profiles
-- set role = 'admin', is_active = true
-- where lower(email) = lower('owner@example.com');
--
-- Promote a staff account after it exists:
-- update public.profiles
-- set role = 'staff', is_active = true
-- where lower(email) = lower('staff@example.com');
--
-- After the first admin is bootstrapped, use /admin/staff to invite staff and
-- admins, assign roles, or deactivate accounts.
