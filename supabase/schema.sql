-- ============================================================================
-- Grainy Palace Farm Limited — database schema
-- Idempotent: safe to re-run. Run this once in the Supabase SQL Editor
-- (or `supabase db push` locally) against a fresh project.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. Helper functions (role checks, updated_at trigger)
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_approved_partner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.partners
    where profile_id = auth.uid() and approved = true
  );
$$;

-- ============================================================================
-- 2. profiles
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('admin', 'staff', 'partner', 'customer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Prevent self-escalation: a logged-in user cannot change their own role or
-- is_active. Service-role calls (auth.uid() is null in that context) and
-- admin-performed updates are unaffected.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.is_active is distinct from old.is_active) then
    if auth.uid() is not null and not public.is_admin() then
      raise exception 'Only admins can change role or active status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileges on public.profiles;
create trigger trg_protect_profile_privileges before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- Auto-create a profile row when a new auth user signs up.
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
create trigger trg_on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ============================================================================
-- 3. site_content (key/value CMS) + hero_slides + page_heroes + gallery_items
--    + social_links + certifications
-- ============================================================================

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  value text,
  updated_at timestamptz not null default now(),
  unique (section, key)
);

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "site_content_select" on public.site_content;
create policy "site_content_select" on public.site_content for select
  using (true);

drop policy if exists "site_content_write" on public.site_content;
create policy "site_content_write" on public.site_content for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  cta_label text,
  cta_href text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_hero_slides_updated_at on public.hero_slides;
create trigger trg_hero_slides_updated_at before update on public.hero_slides
  for each row execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists "hero_slides_select" on public.hero_slides;
create policy "hero_slides_select" on public.hero_slides for select using (is_active = true or public.is_staff());

drop policy if exists "hero_slides_write" on public.hero_slides;
create policy "hero_slides_write" on public.hero_slides for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.page_heroes (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null unique,
  title text not null,
  subtitle text,
  image_url text,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_page_heroes_updated_at on public.page_heroes;
create trigger trg_page_heroes_updated_at before update on public.page_heroes
  for each row execute function public.set_updated_at();

alter table public.page_heroes enable row level security;

drop policy if exists "page_heroes_select" on public.page_heroes;
create policy "page_heroes_select" on public.page_heroes for select using (true);

drop policy if exists "page_heroes_write" on public.page_heroes;
create policy "page_heroes_write" on public.page_heroes for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "gallery_items_select" on public.gallery_items;
create policy "gallery_items_select" on public.gallery_items for select using (true);

drop policy if exists "gallery_items_write" on public.gallery_items;
create policy "gallery_items_write" on public.gallery_items for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.social_links enable row level security;

drop policy if exists "social_links_select" on public.social_links;
create policy "social_links_select" on public.social_links for select using (true);

drop policy if exists "social_links_write" on public.social_links;
create policy "social_links_write" on public.social_links for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  badge_image text,
  issuing_body text,
  status text not null default 'active' check (status in ('active', 'pending')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_certifications_updated_at on public.certifications;
create trigger trg_certifications_updated_at before update on public.certifications
  for each row execute function public.set_updated_at();

alter table public.certifications enable row level security;

drop policy if exists "certifications_select" on public.certifications;
create policy "certifications_select" on public.certifications for select using (true);

drop policy if exists "certifications_write" on public.certifications;
create policy "certifications_write" on public.certifications for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 4. products (public catalogue) + product_batches (traceability)
-- ============================================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  subcategory text not null,
  description text not null default '',
  image_url text,
  gallery text[] not null default '{}',
  price numeric(10, 2) not null check (price >= 0),
  unit text not null,
  tags text[] not null default '{}',
  traceability_note text not null default 'Farm-to-fork QR traceable.',
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category, subcategory);

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "products_select" on public.products;
create policy "products_select" on public.products for select using (true);

drop policy if exists "products_write" on public.products;
create policy "products_write" on public.products for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.product_batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text not null unique,
  product_id uuid references public.products(id) on delete set null,
  harvest_date date,
  origin text,
  certifications text[] not null default '{}',
  coa_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_batches_product_id on public.product_batches (product_id);

drop trigger if exists trg_product_batches_updated_at on public.product_batches;
create trigger trg_product_batches_updated_at before update on public.product_batches
  for each row execute function public.set_updated_at();

alter table public.product_batches enable row level security;

drop policy if exists "product_batches_select" on public.product_batches;
create policy "product_batches_select" on public.product_batches for select using (true);

drop policy if exists "product_batches_write" on public.product_batches;
create policy "product_batches_write" on public.product_batches for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 5. inventory_items (internal, separate from the public catalogue)
-- ============================================================================

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  image_url text,
  price numeric(10, 2) not null check (price >= 0),
  cost_price numeric(10, 2),
  unit text not null,
  stock_quantity numeric(10, 2) not null default 0,
  low_stock_threshold numeric(10, 2) not null default 10,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_inventory_items_updated_at on public.inventory_items;
create trigger trg_inventory_items_updated_at before update on public.inventory_items
  for each row execute function public.set_updated_at();

alter table public.inventory_items enable row level security;

drop policy if exists "inventory_items_all" on public.inventory_items;
create policy "inventory_items_all" on public.inventory_items for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 6. orders + order_items
-- ============================================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_zone text not null default 'accra',
  delivery_address text,
  delivery_fee numeric(10, 2) not null default 0,
  payment_method text not null check (payment_method in ('paystack', 'momo', 'cash', 'bank_transfer')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  status text not null default 'new' check (status in ('new', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders (user_id);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

drop policy if exists "orders_select" on public.orders;
create policy "orders_select" on public.orders for select
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "orders_insert_anon" on public.orders;
create policy "orders_insert_anon" on public.orders for insert
  with check (true);

drop policy if exists "orders_update_staff" on public.orders;
create policy "orders_update_staff" on public.orders for update
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit text not null,
  unit_price numeric(10, 2) not null,
  quantity numeric(10, 2) not null,
  line_total numeric(10, 2) not null
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items for select
  using (
    public.is_staff()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_items_insert_anon" on public.order_items;
create policy "order_items_insert_anon" on public.order_items for insert
  with check (true);

drop policy if exists "order_items_update_staff" on public.order_items;
create policy "order_items_update_staff" on public.order_items for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 7. quote_requests (wholesale / bulk / lab-service enquiries)
-- ============================================================================

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  company text,
  request_type text not null check (request_type in ('wholesale', 'bulk', 'lab_service', 'general')),
  product_or_service text,
  quantity text,
  timeline text,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_quote_requests_updated_at on public.quote_requests;
create trigger trg_quote_requests_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

alter table public.quote_requests enable row level security;

drop policy if exists "quote_requests_insert_anon" on public.quote_requests;
create policy "quote_requests_insert_anon" on public.quote_requests for insert with check (true);

drop policy if exists "quote_requests_staff" on public.quote_requests;
create policy "quote_requests_staff" on public.quote_requests for select using (public.is_staff());

drop policy if exists "quote_requests_update_staff" on public.quote_requests;
create policy "quote_requests_update_staff" on public.quote_requests for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 8. article_categories + articles
-- ============================================================================

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0
);

alter table public.article_categories enable row level security;

drop policy if exists "article_categories_select" on public.article_categories;
create policy "article_categories_select" on public.article_categories for select using (true);

drop policy if exists "article_categories_write" on public.article_categories;
create policy "article_categories_write" on public.article_categories for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.article_categories(id) on delete set null,
  tags text[] not null default '{}',
  excerpt text not null default '',
  cover_image text,
  body text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Grainy Palace Farm Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  reading_time int not null default 1,
  views int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_category_id on public.articles (category_id);
create index if not exists idx_articles_status on public.articles (status, published_at desc);

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "articles_select" on public.articles;
create policy "articles_select" on public.articles for select
  using (status = 'published' or public.is_staff());

drop policy if exists "articles_write" on public.articles;
create policy "articles_write" on public.articles for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 9. events (News & Events)
-- ============================================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null default '',
  cover text,
  event_date date,
  location text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events for select using (is_published = true or public.is_staff());

drop policy if exists "events_write" on public.events;
create policy "events_write" on public.events for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 10. subscriptions (egg / produce subscriptions)
-- ============================================================================

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  plan text not null check (plan in ('weekly', 'monthly')),
  item text not null,
  quantity int not null default 1,
  status text not null default 'new' check (status in ('new', 'active', 'paused', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_insert_anon" on public.subscriptions;
create policy "subscriptions_insert_anon" on public.subscriptions for insert with check (true);

drop policy if exists "subscriptions_staff" on public.subscriptions;
create policy "subscriptions_staff" on public.subscriptions for select using (public.is_staff());

drop policy if exists "subscriptions_update_staff" on public.subscriptions;
create policy "subscriptions_update_staff" on public.subscriptions for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 11. outgrower_applications
-- ============================================================================

create table if not exists public.outgrower_applications (
  id uuid primary key default gen_random_uuid(),
  farmer_name text not null,
  phone text not null,
  email text,
  location text not null,
  crop text not null,
  land_size text,
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_outgrower_applications_updated_at on public.outgrower_applications;
create trigger trg_outgrower_applications_updated_at before update on public.outgrower_applications
  for each row execute function public.set_updated_at();

alter table public.outgrower_applications enable row level security;

drop policy if exists "outgrower_applications_insert_anon" on public.outgrower_applications;
create policy "outgrower_applications_insert_anon" on public.outgrower_applications for insert with check (true);

drop policy if exists "outgrower_applications_staff" on public.outgrower_applications;
create policy "outgrower_applications_staff" on public.outgrower_applications for select using (public.is_staff());

drop policy if exists "outgrower_applications_update_staff" on public.outgrower_applications;
create policy "outgrower_applications_update_staff" on public.outgrower_applications for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 12. job_openings + job_applications
-- ============================================================================

create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  description text not null default '',
  location text not null default 'Greater Accra',
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_job_openings_updated_at on public.job_openings;
create trigger trg_job_openings_updated_at before update on public.job_openings
  for each row execute function public.set_updated_at();

alter table public.job_openings enable row level security;

drop policy if exists "job_openings_select" on public.job_openings;
create policy "job_openings_select" on public.job_openings for select using (is_open = true or public.is_staff());

drop policy if exists "job_openings_write" on public.job_openings;
create policy "job_openings_write" on public.job_openings for all
  using (public.is_staff()) with check (public.is_staff());

--

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  opening_id uuid references public.job_openings(id) on delete set null,
  applicant_name text not null,
  phone text not null,
  email text,
  cv_url text,
  cover_note text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_applications_opening_id on public.job_applications (opening_id);

drop trigger if exists trg_job_applications_updated_at on public.job_applications;
create trigger trg_job_applications_updated_at before update on public.job_applications
  for each row execute function public.set_updated_at();

alter table public.job_applications enable row level security;

drop policy if exists "job_applications_insert_anon" on public.job_applications;
create policy "job_applications_insert_anon" on public.job_applications for insert with check (true);

drop policy if exists "job_applications_staff" on public.job_applications;
create policy "job_applications_staff" on public.job_applications for select using (public.is_staff());

drop policy if exists "job_applications_update_staff" on public.job_applications;
create policy "job_applications_update_staff" on public.job_applications for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 13. partners (B2B portal accounts)
-- ============================================================================

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  business_type text,
  tier text not null default 'standard' check (tier in ('standard', 'silver', 'gold')),
  approved boolean not null default false,
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partners_profile_id on public.partners (profile_id);

drop trigger if exists trg_partners_updated_at on public.partners;
create trigger trg_partners_updated_at before update on public.partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;

drop policy if exists "partners_select" on public.partners;
create policy "partners_select" on public.partners for select
  using (profile_id = auth.uid() or public.is_staff());

drop policy if exists "partners_insert_self" on public.partners;
create policy "partners_insert_self" on public.partners for insert
  with check (profile_id = auth.uid());

drop policy if exists "partners_update_staff" on public.partners;
create policy "partners_update_staff" on public.partners for update
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 14. lab_samples (food-safety lab)
-- ============================================================================

create table if not exists public.lab_samples (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  client_name text not null,
  client_phone text not null,
  client_email text,
  sample_type text not null,
  tests text[] not null default '{}',
  status text not null default 'received' check (status in ('received', 'testing', 'complete')),
  coa_url text,
  notes text,
  submitted_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_lab_samples_updated_at on public.lab_samples;
create trigger trg_lab_samples_updated_at before update on public.lab_samples
  for each row execute function public.set_updated_at();

alter table public.lab_samples enable row level security;

-- Full table is staff-only; the public results tracker uses the
-- lookup_lab_sample() function below instead of a broad SELECT policy.
drop policy if exists "lab_samples_staff" on public.lab_samples;
create policy "lab_samples_staff" on public.lab_samples for select using (public.is_staff());

drop policy if exists "lab_samples_insert_anon" on public.lab_samples;
create policy "lab_samples_insert_anon" on public.lab_samples for insert with check (true);

drop policy if exists "lab_samples_update_staff" on public.lab_samples;
create policy "lab_samples_update_staff" on public.lab_samples for update
  using (public.is_staff()) with check (public.is_staff());

-- Public, reference-scoped lookup: returns only status + CoA, never client PII.
create or replace function public.lookup_lab_sample(p_reference text)
returns table (reference text, sample_type text, status text, coa_url text, submitted_at timestamptz, completed_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select reference, sample_type, status, coa_url, submitted_at, completed_at
  from public.lab_samples
  where reference = p_reference;
$$;

grant execute on function public.lookup_lab_sample(text) to anon, authenticated;

-- ============================================================================
-- 15. Storage buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- media: product images, article/hero covers, gallery, certification badges,
-- and Certificates of Analysis (CoAs are meant to be publicly downloadable
-- once a lab sample/batch is complete, so they live here rather than the
-- private bucket). Staff-only write.
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_staff_write" on storage.objects;
create policy "media_staff_write" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media_staff_update" on storage.objects;
create policy "media_staff_update" on storage.objects for update
  using (bucket_id = 'media' and public.is_staff());

drop policy if exists "media_staff_delete" on storage.objects;
create policy "media_staff_delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_staff());

-- documents: job-application CVs. Anonymous applicants need to upload their
-- own CV without an account, but only staff can list/read/delete — so the
-- insert check is intentionally broad while read/write-back stays staff-only.
drop policy if exists "documents_anon_insert" on storage.objects;
create policy "documents_anon_insert" on storage.objects for insert
  with check (bucket_id = 'documents');

drop policy if exists "documents_staff_read" on storage.objects;
create policy "documents_staff_read" on storage.objects for select
  using (bucket_id = 'documents' and public.is_staff());

drop policy if exists "documents_staff_delete" on storage.objects;
create policy "documents_staff_delete" on storage.objects for delete
  using (bucket_id = 'documents' and public.is_staff());

-- ============================================================================
-- Seed data
-- ============================================================================

-- Article categories (Knowledge Hub)
insert into public.article_categories (name, slug, description, sort_order) values
  ('Nutrition', 'nutrition', 'Eating well with whole, minimally processed farm foods.', 1),
  ('Food Safety', 'food-safety', 'Handling, storage and traceability guidance.', 2),
  ('Environmental Protection', 'environmental-protection', 'How our operations protect soil, water and air.', 3),
  ('Sustainable Agriculture', 'sustainable-agriculture', 'Regenerative and climate-smart farming practices.', 4),
  ('Livestock & Animal Welfare', 'livestock-animal-welfare', 'Humane rearing and antibiotic stewardship.', 5),
  ('Aquaculture & Fish Farming', 'aquaculture-fish-farming', 'Our integrated fish-crop circular system.', 6),
  ('Farming Tips & Guides', 'farming-tips-guides', 'Practical guidance for smallholders and outgrowers.', 7),
  ('Recipes', 'recipes', 'Ghanaian recipes using Grainy Palace Farm produce.', 8),
  ('Company News & Events', 'company-news-events', 'Announcements, trade fairs and community events.', 9)
on conflict (slug) do nothing;

-- Starter articles
insert into public.articles (title, slug, category_id, tags, excerpt, body, author_name, status, featured, reading_time, published_at)
select
  'Why Whole Grains Belong on Every Ghanaian Plate',
  'why-whole-grains-belong-on-every-ghanaian-plate',
  (select id from public.article_categories where slug = 'nutrition'),
  array['grains', 'nutrition', 'diet'],
  'Milled maize, millet and sorghum carry more fibre and micronutrients than their refined counterparts — here''s what that means for your household''s health.',
  E'# Why Whole Grains Belong on Every Ghanaian Plate\n\nAcross Greater Accra and Ashanti Region, maize, millet and sorghum have fed families for generations. What has changed in recent decades is how much of that grain reaches the table in its whole form.\n\n## What "whole grain" actually means\n\nA whole grain keeps its bran and germ layers intact through milling. Those layers carry most of the fibre, B-vitamins, iron and zinc in the kernel. Heavily refined flours strip much of this away, leaving mostly starch.\n\n## Why it matters for everyday meals\n\n- **Slower energy release** — whole grains digest more slowly, which helps with steady energy through a working day and better blood sugar control.\n- **More iron and zinc** — important in a country where anaemia remains common, especially among women and children.\n- **Better gut health** — the fibre in whole millet and sorghum feeds beneficial gut bacteria.\n\n## How we keep it whole\n\nAt Grainy Palace Farm, our milled maize and sorghum are stone-milled in small batches rather than industrially refined, so more of the bran stays in the final product. Every bag we sell carries a batch code you can look up on our [traceability page](/traceability) to see exactly which field it came from and when it was milled.\n\n## A simple swap to start with\n\nIf your household eats a lot of refined maize meal, try substituting our milled maize or sorghum flour for half the quantity in your next batch of banku or tuo zaafi. The taste difference is subtle; the nutrition difference is not.',
  'Grainy Palace Farm Nutrition Desk',
  'published', true, 4, now() - interval '18 days'
on conflict (slug) do nothing;

insert into public.articles (title, slug, category_id, tags, excerpt, body, author_name, status, featured, reading_time, published_at)
select
  'How We Keep Fresh Tilapia Safe From Pond to Market',
  'how-we-keep-fresh-tilapia-safe-from-pond-to-market',
  (select id from public.article_categories where slug = 'food-safety'),
  array['fish', 'cold-chain', 'food-safety'],
  'A look inside the cold-chain and testing steps that stand between our aquaculture ponds and your kitchen.',
  E'# How We Keep Fresh Tilapia Safe From Pond to Market\n\nFish spoils faster than almost any other food we sell, so our food-safety controls for tilapia and catfish are the strictest in our operation.\n\n## Harvest and cooling\n\nFish are harvested early in the morning when water and air temperatures are lowest. From the moment they leave the pond, they move into ice-slurry crates — never left at ambient temperature.\n\n## Testing before dispatch\n\nOur [Lab Services](/lab-services) team runs microbiological and water-quality checks on every production pond on a rolling schedule, and spot-checks finished batches for histamine and heavy metals before they''re released for sale.\n\n## The cold chain to your door\n\nDelivery vehicles for fresh and frozen fish run insulated coolers with ice packs, and our riders are trained to reject any delivery window that would break the cold chain. If you order smoked catfish instead, the smoking process itself extends shelf life safely, but we still test finished batches for aflatoxin, a risk in poorly dried smoked fish.\n\n## What you can check at home\n\nFresh tilapia should have clear eyes, red gills and a clean sea-like smell — not a strong "fishy" odour. Every pack carries a batch code linking back to harvest date and pond, viewable on our [traceability page](/traceability).',
  'Grainy Palace Farm Food Safety Lab',
  'published', true, 4, now() - interval '11 days'
on conflict (slug) do nothing;

insert into public.articles (title, slug, category_id, tags, excerpt, body, author_name, status, featured, reading_time, published_at)
select
  'Inside Our Zero-Waste, Circular Farm System',
  'inside-our-zero-waste-circular-farm-system',
  (select id from public.article_categories where slug = 'environmental-protection'),
  array['sustainability', 'circular economy', 'water'],
  'Fish pond water fertilises our fields, crop residue feeds our livestock — how one farm''s waste becomes another''s input.',
  E'# Inside Our Zero-Waste, Circular Farm System\n\nGrainy Palace Farm was built around a simple idea: on an integrated farm, nothing has to go to waste — it just needs the right next use.\n\n## Fish pond water, field fertiliser\n\nNutrient-rich water from our tilapia and catfish ponds is periodically released to irrigate adjacent vegetable and grain plots, cutting our need for synthetic fertiliser while giving pond water somewhere useful to go instead of being discharged untreated.\n\n## Crop residue, livestock feed\n\nMaize stover, cassava peel and groundnut husks that would otherwise be burned or dumped are dried and blended into our livestock feed formulations, alongside purchased feed ingredients.\n\n## Manure, compost\n\nPoultry and livestock manure is composted on-site and sold as organic compost fertiliser, closing the loop back into crop production — ours and our customers''.\n\n## Packaging aligned with the Plastics Levy\n\nGhana''s 2021 Plastics Levy pushed the whole industry to rethink packaging. We pack dry goods in biodegradable or reusable woven bags wherever the product allows, and are phasing out single-use plastic sachets across our processed food lines.\n\n## Why this matters beyond our farm gate\n\nA circular system lowers our costs, which is part of how we keep prices fair for Ghanaian households — and it means less agricultural waste ending up in landfill or waterways in Greater Accra and Ashanti Region.',
  'Grainy Palace Farm Sustainability Team',
  'published', true, 4, now() - interval '25 days'
on conflict (slug) do nothing;

insert into public.articles (title, slug, category_id, tags, excerpt, body, author_name, status, featured, reading_time, published_at)
select
  'Contract Farming Explained: How Our Outgrower Scheme Works',
  'contract-farming-explained-how-our-outgrower-scheme-works',
  (select id from public.article_categories where slug = 'sustainable-agriculture'),
  array['outgrowers', 'smallholders', 'contract farming'],
  'Certified seeds, training and a guaranteed offtake price — what it actually means to farm alongside Grainy Palace Farm as an outgrower.',
  E'# Contract Farming Explained: How Our Outgrower Scheme Works\n\nMost of the maize, soybean and sorghum we sell is grown on our own fields — but a growing share comes from independent smallholders in our outgrower scheme.\n\n## What we provide\n\n- **Certified seed** at the start of the season, deducted from final payment rather than paid upfront.\n- **Agronomy training** on spacing, fertiliser timing and post-harvest handling, delivered by our field officers.\n- **A fixed offtake price** agreed before planting, so farmers aren''t exposed to harvest-time price crashes.\n\n## What we ask in return\n\nOutgrowers commit to selling their contracted volume to Grainy Palace Farm at harvest, follow the agreed input and spacing guidelines (so produce meets our traceability and quality standards), and allow periodic field visits from our agronomy team.\n\n## Why this beats going it alone for many smallholders\n\nPrice volatility and lack of guaranteed buyers are two of the biggest risks smallholder farmers in Ghana face. A fixed-price contract removes the second risk almost entirely, and access to certified seed on credit removes a common cash-flow barrier at planting time.\n\n## How to apply\n\nIf you farm in Greater Accra or Ashanti Region and want to join the scheme, visit our [Careers & Outgrowers page](/careers) and submit the outgrower application form. Our field team reviews applications on a rolling basis ahead of each planting season.',
  'Grainy Palace Farm Agronomy Team',
  'published', false, 5, now() - interval '6 days'
on conflict (slug) do nothing;

insert into public.articles (title, slug, category_id, tags, excerpt, body, author_name, status, featured, reading_time, published_at)
select
  'Five Ways to Cook With Our Cold-Pressed Groundnut Oil',
  'five-ways-to-cook-with-our-cold-pressed-groundnut-oil',
  (select id from public.article_categories where slug = 'recipes'),
  array['recipes', 'groundnut oil', 'cooking'],
  'From groundnut soup to a simple kontomire stir-fry, our cold-pressed oil holds its flavour better than refined alternatives.',
  E'# Five Ways to Cook With Our Cold-Pressed Groundnut Oil\n\nCold-pressing keeps more of groundnut oil''s natural flavour and nutrients than industrial refining. Here are five ways our customers use it most.\n\n1. **Base for groundnut soup** — a spoonful added at the start of frying your onion and tomato base deepens the nutty flavour the soup is named for.\n2. **Kontomire (cocoyam leaf) stir-fry** — a high smoke point makes it suitable for the hot pan this dish needs.\n3. **Frying plantain (kelewele or chips)** — holds up well to repeated frying without breaking down as quickly as some refined oils.\n4. **Salad dressings** — whisked with lime juice and a pinch of salt for a simple, nutty dressing.\n5. **Finishing drizzle on waakye** — a small amount stirred through just before serving adds richness.\n\nStore it in a cool, dark cupboard rather than next to the stove, and use within a few months of opening for the best flavour.',
  'Grainy Palace Farm Kitchen',
  'published', false, 3, now() - interval '3 days'
on conflict (slug) do nothing;

-- Certifications
insert into public.certifications (name, issuing_body, status, sort_order) values
  ('FDA Registered', 'Food and Drugs Authority, Ghana', 'active', 1),
  ('MOFA Certified', 'Ministry of Food and Agriculture', 'active', 2),
  ('Veterinary Services Directorate (VSD)', 'Ministry of Food and Agriculture', 'active', 3),
  ('Fisheries Commission Licensed', 'Fisheries Commission of Ghana', 'active', 4),
  ('EPA Compliant', 'Environmental Protection Agency, Ghana', 'active', 5),
  ('HACCP', 'Independent third-party audit', 'active', 6),
  ('Halal Certified', 'Ghana Halal Certification Board', 'active', 7),
  ('Organic Certified', 'Ecocert-affiliated inspector', 'active', 8),
  ('ISO 22000', 'International Organization for Standardization', 'pending', 9)
on conflict do nothing;

-- Hero slides
insert into public.hero_slides (title, subtitle, cta_label, cta_href, sort_order) values
  ('Certified farm food, delivered across Ghana', 'From our certified fields to your table — safe, natural, and traceable.', 'Shop Now', '/shop', 1),
  ('Fresh tilapia and catfish, farm to fork', 'Our integrated aquaculture ponds supply fresh, smoked and frozen fish weekly.', 'Explore Fish & Aquaculture', '/fish', 2),
  ('Grow with us: join the outgrower scheme', 'Certified seeds, training and a fair, fixed offtake price for smallholder farmers.', 'Apply as an Outgrower', '/careers', 3)
on conflict do nothing;

-- Events
insert into public.events (title, slug, body, event_date, location, is_published) values
  ('Grainy Palace Farm at the Accra Agribusiness Trade Fair', 'accra-agribusiness-trade-fair-2026', 'Visit our stand at the Accra Agribusiness Trade Fair to sample our organic flours and meet our wholesale team.', current_date + interval '25 days', 'Accra International Conference Centre', true),
  ('Community Health Outreach in Dodowa', 'community-health-outreach-dodowa', 'As part of our 2%-of-profit community commitment, we partnered with local health workers for a nutrition and food-safety outreach day.', current_date - interval '20 days', 'Dodowa, Greater Accra Region', true)
on conflict (slug) do nothing;

-- Job openings
insert into public.job_openings (title, department, description, location, is_open) values
  ('Field Agronomist', 'Crop Production', 'Support outgrower training and monitor field trials across our maize, soybean and vegetable plots.', 'Greater Accra Region', true),
  ('Food Safety Lab Technician', 'Quality Assurance', 'Run microbiological and chemical residue testing for our food-safety lab, and support CoA turnaround for partners.', 'Greater Accra Region', true),
  ('Delivery Rider', 'Logistics', 'Handle last-mile delivery of fresh produce, fish and livestock products across Accra.', 'Greater Accra Region', true),
  ('Livestock Farmhand', 'Livestock', 'Daily care, feeding and welfare monitoring for our poultry and small ruminant operations. Entry-level; training provided.', 'Ashanti Region', true)
on conflict do nothing;

-- ============================================================================
-- Products (full catalogue per taxonomy — see lib/taxonomy.ts)
-- ============================================================================

insert into public.products (name, slug, category, subcategory, description, price, unit, tags, is_available, sort_order) values
-- Grains & Cereals
('Premium White Maize (Grain)', 'premium-white-maize-grain', 'grains-cereals', 'maize-grain', 'Certified white maize grain, sun-dried and cleaned, sourced from our own fields and outgrower partners.', 8.00, 'kg', array['Certified','Traceable'], true, 1),
('Stone-Milled Maize Flour', 'stone-milled-maize-flour', 'grains-cereals', 'milled-maize', 'Stone-milled maize flour that retains more bran and germ than industrially refined flour, ideal for banku and kenkey.', 10.00, 'kg', array['Certified','Traceable'], true, 2),
('Long Grain Milled Rice', 'long-grain-milled-rice', 'grains-cereals', 'rice', 'Locally grown long-grain rice, parboiled and milled, with minimal broken grains.', 18.00, 'kg', array['Certified','Traceable'], true, 3),
('Paddy Rice (Unmilled)', 'paddy-rice-unmilled', 'grains-cereals', 'rice', 'Unmilled paddy rice for processors and mills, sold in bulk by the bag.', 14.00, 'kg', array['Certified','Traceable'], true, 4),
('Whole Grain Millet', 'whole-grain-millet', 'grains-cereals', 'millet', 'Cleaned whole-grain millet, a fibre-rich staple for porridge and tuo zaafi.', 12.00, 'kg', array['Organic','Traceable'], true, 5),
('Whole Grain Sorghum', 'whole-grain-sorghum', 'grains-cereals', 'sorghum', 'Cleaned whole-grain sorghum, well suited to porridge, swish and animal feed blending.', 11.00, 'kg', array['Traceable'], true, 6),
-- Legumes & Nuts
('Black-Eyed Cowpea (Beans)', 'black-eyed-cowpea-beans', 'legumes-nuts', 'cowpea', 'Sorted black-eyed cowpea, ideal for waakye, red-red and gari-beans.', 22.00, 'kg', array['Certified','Traceable'], true, 7),
('Certified Soybean', 'certified-soybean', 'legumes-nuts', 'soybean', 'High-protein soybean, suitable for soy milk, dawadawa alternatives and feed processing.', 16.00, 'kg', array['Certified','Traceable'], true, 8),
('Roasted Groundnut (Shelled)', 'roasted-groundnut-shelled', 'legumes-nuts', 'groundnut', 'Shelled, sorted groundnut, lightly roasted and ready for groundnut soup or snacking.', 24.00, 'kg', array['Traceable'], true, 9),
-- Vegetables
('Fresh Tomatoes (Crate)', 'fresh-tomatoes-crate', 'vegetables', 'tomatoes', 'A full crate of vine-ripened fresh tomatoes, harvested within 48 hours of delivery.', 180.00, 'crate', array['Fresh','Traceable'], true, 10),
('Fresh Okra', 'fresh-okra', 'vegetables', 'okra', 'Tender fresh okra pods, hand-picked at peak size for soups and stews.', 14.00, 'kg', array['Fresh','Traceable'], true, 11),
('Fresh Garden Eggs', 'fresh-garden-eggs', 'vegetables', 'garden-eggs', 'Fresh garden eggs (African eggplant), a staple for garden egg stew and salads.', 12.00, 'kg', array['Fresh','Traceable'], true, 12),
('Fresh Scotch Bonnet Pepper', 'fresh-scotch-bonnet-pepper', 'vegetables', 'pepper', 'Fresh scotch bonnet pepper, hand-sorted for consistent heat and colour.', 20.00, 'kg', array['Fresh','Traceable'], true, 13),
-- Roots & Tubers
('Fresh Cassava', 'fresh-cassava', 'roots-tubers', 'cassava', 'Freshly harvested cassava tubers, suitable for gari, fufu and cassava flour processing.', 6.00, 'kg', array['Fresh','Traceable'], true, 14),
('Fresh Yam (Puna Variety)', 'fresh-yam-puna-variety', 'roots-tubers', 'yam', 'Puna yam tubers, a popular variety for boiling, roasting and ampesi.', 9.00, 'kg', array['Fresh','Traceable'], true, 15),
('Fresh Cocoyam', 'fresh-cocoyam', 'roots-tubers', 'cocoyam', 'Fresh cocoyam corms, suited to ampesi, cocoyam fufu and soups.', 8.00, 'kg', array['Fresh','Traceable'], true, 16),
-- Cash & Industrial Crops
('Sesame Seed (Beniseed)', 'sesame-seed-beniseed', 'cash-industrial-crops', 'sesame', 'Cleaned sesame seed for oil pressing, confectionery and export.', 28.00, 'kg', array['Certified','Traceable'], true, 17),
('Raw Shea Nuts', 'raw-shea-nuts', 'cash-industrial-crops', 'shea', 'Sun-dried shea nuts, sold in bulk to processors for butter extraction.', 15.00, 'kg', array['Traceable'], true, 18),
-- Poultry & Eggs
('Dressed Chicken (Whole)', 'dressed-chicken-whole', 'poultry-eggs', 'dressed-chicken', 'Whole dressed chicken, cleaned and chilled, approx. 1.2–1.5kg per bird.', 55.00, 'each', array['Fresh','Traceable'], true, 19),
('Frozen Chicken Portions (Mixed)', 'frozen-chicken-portions-mixed', 'poultry-eggs', 'frozen-chicken-portions', 'Mixed cuts of frozen chicken portions — thighs, drumsticks and wings.', 38.00, 'kg', array['Frozen','Traceable'], true, 20),
('Live Broiler Chicken', 'live-broiler-chicken', 'poultry-eggs', 'live-broilers', 'Live broiler chicken, ready for festive-season orders and live-animal buyers.', 65.00, 'each', array['Traceable'], true, 21),
('Cage-Free Table Eggs (Crate of 30)', 'cage-free-table-eggs-crate-of-30', 'poultry-eggs', 'table-eggs', 'A full crate of 30 cage-free table eggs from our free-range layer flock.', 58.00, 'crate', array['Cage-Free','Traceable'], true, 22),
('Guinea Fowl (Whole)', 'guinea-fowl-whole', 'poultry-eggs', 'guinea-fowl', 'Whole dressed guinea fowl, popular for festive and ceremonial meals.', 90.00, 'each', array['Fresh','Traceable'], true, 23),
-- Meat & Livestock
('Chevon (Goat Meat)', 'chevon-goat-meat', 'meat-livestock', 'chevon-goat', 'Fresh chevon (goat meat), butchered on request for light soup and grilling.', 65.00, 'kg', array['Fresh','Halal','Traceable'], true, 24),
('Mutton (Sheep Meat)', 'mutton-sheep-meat', 'meat-livestock', 'mutton-sheep', 'Fresh mutton, well suited to waakye stew and grilled dishes.', 62.00, 'kg', array['Fresh','Halal','Traceable'], true, 25),
('Fresh Pork Cuts', 'fresh-pork-cuts', 'meat-livestock', 'pork', 'Fresh pork cuts from our own piggery, chilled for same-week delivery.', 45.00, 'kg', array['Fresh','Traceable'], true, 26),
('Live Rabbit', 'live-rabbit', 'meat-livestock', 'rabbit', 'Live rabbit, raised on our small ruminant unit — a lean, low-fat meat option.', 80.00, 'each', array['Traceable'], true, 27),
('Live Goat (Festive Order)', 'live-goat-festive-order', 'meat-livestock', 'live-animals', 'Live goat for festive-season and ceremonial orders — please order at least 5 days ahead.', 850.00, 'each', array['Traceable'], true, 28),
('Halal Beef (Coming Soon)', 'halal-beef-coming-soon', 'meat-livestock', 'halal-beef', 'Halal-certified beef is in development as part of our Phase 2 product range.', 50.00, 'kg', array['Halal'], false, 29),
-- Fish & Seafood
('Fresh Tilapia', 'fresh-tilapia', 'fish-seafood', 'fresh-tilapia', 'Fresh tilapia harvested from our aquaculture ponds and delivered on ice the same day.', 35.00, 'kg', array['Fresh','Traceable'], true, 30),
('Fresh Catfish', 'fresh-catfish', 'fish-seafood', 'fresh-catfish', 'Fresh catfish from our integrated fish-crop ponds, delivered on ice.', 40.00, 'kg', array['Fresh','Traceable'], true, 31),
('Smoked Catfish', 'smoked-catfish', 'fish-seafood', 'smoked-catfish', 'Traditionally smoked catfish, tested for aflatoxin before release for sale.', 70.00, 'kg', array['Smoked','Traceable'], true, 32),
('Frozen Tilapia Fillets', 'frozen-tilapia-fillets', 'fish-seafood', 'frozen-tilapia-fillets', 'Boneless frozen tilapia fillets, individually quick-frozen for freshness.', 55.00, 'kg', array['Frozen','Traceable'], true, 33),
-- Seedlings
('Oil Palm Seedling', 'oil-palm-seedling', 'seedlings', 'oil-palm', 'Certified oil palm seedling, ready for transplant, from our nursery.', 12.00, 'seedling', array['Certified'], true, 34),
('Cocoa Seedling', 'cocoa-seedling', 'seedlings', 'cocoa', 'High-yield cocoa seedling grafted from disease-tolerant parent stock.', 8.00, 'seedling', array['Certified'], true, 35),
('Cashew Seedling', 'cashew-seedling', 'seedlings', 'cashew', 'Cashew seedling suited to Ghana''s savanna and transition zones.', 10.00, 'seedling', array['Certified'], true, 36),
('Grafted Mango Seedling', 'grafted-mango-seedling', 'seedlings', 'mango', 'Grafted mango seedling for earlier fruiting than seed-grown stock.', 15.00, 'seedling', array['Certified'], true, 37),
('Citrus Seedling', 'citrus-seedling', 'seedlings', 'citrus', 'Grafted citrus seedling (orange/lime varieties available on request).', 15.00, 'seedling', array['Certified'], true, 38),
('Moringa Seedling', 'moringa-seedling', 'seedlings', 'moringa', 'Fast-growing moringa seedling, valued for its nutrient-dense leaves.', 6.00, 'seedling', array['Organic','Certified'], true, 39),
('Shea Seedling', 'shea-tree-seedling', 'seedlings', 'shea-seedling', 'Shea tree seedling for agroforestry and long-term income diversification.', 10.00, 'seedling', array['Certified'], true, 40),
('Teak Seedling', 'teak-seedling', 'seedlings', 'teak', 'Teak seedling for woodlot and plantation forestry investment.', 5.00, 'seedling', array['Certified'], true, 41),
('Plantain Sucker', 'plantain-sucker', 'seedlings', 'plantain-suckers', 'Disease-free plantain sucker, ready for transplanting.', 8.00, 'seedling', array['Certified'], true, 42),
('Mixed Agroforestry Seedling Pack', 'mixed-agroforestry-seedling-pack', 'seedlings', 'mixed-agroforestry', 'A mixed pack of agroforestry seedlings for diversified plantation planning.', 7.00, 'seedling', array['Certified'], true, 43),
-- Processed & Value-Added Foods
('Organic Maize Flour', 'organic-maize-flour', 'processed-foods', 'organic-flours', 'Certified organic maize flour, milled without synthetic inputs at any growth stage.', 20.00, 'kg', array['Organic','Certified'], true, 44),
('Organic Cassava Flour', 'organic-cassava-flour', 'processed-foods', 'organic-flours', 'Certified organic cassava flour (gari-adjacent), gluten-free and versatile.', 18.00, 'kg', array['Organic','Certified'], true, 45),
('Organic Soybean Flour', 'organic-soybean-flour', 'processed-foods', 'organic-flours', 'High-protein organic soybean flour for weaning mixes and baking.', 25.00, 'kg', array['Organic','Certified'], true, 46),
('Weaning Porridge Mix', 'weaning-porridge-mix', 'processed-foods', 'porridge-weaning-mixes', 'A maize-soybean-groundnut weaning porridge blend formulated for infant nutrition.', 28.00, 'pack', array['Organic'], true, 47),
('Cold-Pressed Groundnut Oil', 'cold-pressed-groundnut-oil', 'processed-foods', 'cold-pressed-oils', 'Cold-pressed groundnut oil retaining more natural flavour and nutrients than refined oil.', 55.00, 'litre', array['Organic','Traceable'], true, 48),
('Cold-Pressed Sesame Oil', 'cold-pressed-sesame-oil', 'processed-foods', 'cold-pressed-oils', 'Cold-pressed sesame oil, ideal for finishing dishes and light frying.', 65.00, 'litre', array['Organic','Traceable'], true, 49),
('Dried Vegetable Pack (Mixed)', 'dried-vegetable-pack-mixed', 'processed-foods', 'dried-vegetable-packs', 'A mixed pack of sun-dried vegetables for soups and stews with a longer shelf life.', 15.00, 'pack', array['Traceable'], true, 50),
('Grainy Palace Gift Basket', 'grainy-palace-gift-basket', 'processed-foods', 'gift-baskets', 'A branded gift basket of our grains, flours and cold-pressed oil — a popular corporate gift.', 250.00, 'each', array['Certified'], true, 51),
-- Farm Inputs & Feed
('Broiler Starter Feed (25kg Bag)', 'broiler-starter-feed-25kg-bag', 'farm-inputs-feed', 'livestock-feed', 'Balanced broiler starter feed formulated for the first weeks of a flock''s life.', 180.00, 'bag', array['Certified'], true, 52),
('Organic Compost Fertiliser (25kg Bag)', 'organic-compost-fertiliser-25kg-bag', 'farm-inputs-feed', 'organic-compost', 'Composted poultry and livestock manure, screened and bagged for garden and field use.', 45.00, 'bag', array['Organic','Certified'], true, 53),
('Certified Maize Seed', 'certified-maize-seed', 'farm-inputs-feed', 'seeds-fingerlings', 'Certified, disease-tested maize seed for the coming planting season.', 25.00, 'kg', array['Certified'], true, 54),
('Tilapia Fingerlings (100)', 'tilapia-fingerlings-100', 'farm-inputs-feed', 'seeds-fingerlings', 'A batch of 100 certified tilapia fingerlings for pond stocking.', 90.00, 'pack', array['Certified'], true, 55)
on conflict (slug) do nothing;

-- Sample traceability batches for a handful of flagship products
insert into public.product_batches (batch_code, product_id, harvest_date, origin, certifications, notes)
select 'GPF-MZ-2607', id, current_date - interval '10 days', 'Grainy Palace Farm, Greater Accra Region', array['FDA Registered','Certified'], 'Sun-dried and cleaned within 48 hours of harvest.'
from public.products where slug = 'premium-white-maize-grain'
on conflict (batch_code) do nothing;

insert into public.product_batches (batch_code, product_id, harvest_date, origin, certifications, notes)
select 'GPF-TL-2607', id, current_date - interval '2 days', 'Grainy Palace Farm Aquaculture Unit, Greater Accra Region', array['Fisheries Commission Licensed','HACCP'], 'Harvested at dawn and delivered same-day on ice.'
from public.products where slug = 'fresh-tilapia'
on conflict (batch_code) do nothing;

insert into public.product_batches (batch_code, product_id, harvest_date, origin, certifications, notes)
select 'GPF-EG-2607', id, current_date - interval '1 days', 'Grainy Palace Farm Poultry Unit, Ashanti Region', array['MOFA Certified','Cage-Free'], 'Packed within 24 hours of lay.'
from public.products where slug = 'cage-free-table-eggs-crate-of-30'
on conflict (batch_code) do nothing;

-- ============================================================================
-- Default site_content (contact/brand fields — Ghana defaults, editable in /admin)
-- ============================================================================

insert into public.site_content (section, key, value) values
  ('contact', 'phone', '+233 20 123 4567'),
  ('contact', 'whatsapp', '233201234567'),
  ('contact', 'email', 'info@grainypalacefarm.com'),
  ('contact', 'address', 'Plot 14, Adenta-Dodowa Road, Greater Accra Region, Ghana'),
  ('contact', 'hours', 'Monday – Saturday, 7:00am – 6:00pm GMT'),
  ('brand', 'name', 'Grainy Palace Farm Limited'),
  ('brand', 'tagline', 'Cultivating Excellence. Feeding the Future.'),
  ('brand', 'promise', 'From our certified fields to your table — safe, natural, and traceable.'),
  ('delivery', 'accra_flat_fee', '25'),
  ('delivery', 'nationwide_flat_fee', '60'),
  ('delivery', 'pickup_available', 'true')
on conflict (section, key) do nothing;
