-- Proposed schema for the website's dedicated Supabase project.
-- NOT APPLIED. Review the target database before running.
begin;
create table public.website_quote_requests (
  request_id uuid primary key,
  created_at timestamptz not null default now(),
  consent_at timestamptz not null,
  collection text not null check (collection in ('boutiques-createurs','beaute-parfumerie','cadeaux-entreprise','papeterie-de-marque','plusieurs-univers')),
  product text not null default '' check (char_length(product)<=150),
  quantity integer not null check (quantity between 1 and 1000000),
  budget text not null check (budget in ('a-definir','moins-5000','5000-15000','15000-50000','plus-50000')),
  timeline text not null default '' check (char_length(timeline)<=100),
  notes text not null default '' check (char_length(notes)<=3000),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email)<=254),
  phone text not null default '' check (char_length(phone)<=30),
  status text not null default 'new' check (status in ('new','contacted','quoted','closed'))
);
alter table public.website_quote_requests enable row level security;
revoke all on public.website_quote_requests from anon, authenticated;
grant insert on public.website_quote_requests to service_role;
-- No public policies: quote requests must never be readable from the browser.
create index website_quote_requests_created_idx on public.website_quote_requests (created_at desc);

-- Future managed catalogue: drafts remain inaccessible to visitors.
-- The first preview currently uses src/lib/catalogue.ts, not this table.
create table public.website_products (
  slug text primary key,
  collection text not null,
  name text not null,
  description text not null,
  image_path text,
  options jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.website_products enable row level security;
revoke all on public.website_products from anon, authenticated;
grant select on public.website_products to anon, authenticated;
create policy published_catalogue_read on public.website_products for select to anon, authenticated using (published = true);
commit;
