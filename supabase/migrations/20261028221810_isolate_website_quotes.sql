-- Applied to IBHAR ADS on 2026-10-28; do not replay.
-- Login and generated password provisioned separately, never stored in source.
-- Target: quuaxpnaugcmburokhko. Fail on name collisions; never replace objects.
-- No manager tables, policies, auth settings or default privileges are modified.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '15s';
create role ibhar_website_writer nologin noinherit nosuperuser nocreatedb
  nocreaterole noreplication nobypassrls;
create schema ibhar_website;
revoke all on schema ibhar_website from public, anon, authenticated, service_role;
create table ibhar_website.quote_requests (
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
alter table ibhar_website.quote_requests enable row level security;
alter table ibhar_website.quote_requests force row level security;
revoke all on ibhar_website.quote_requests from public, anon, authenticated, service_role;
grant usage on schema ibhar_website to ibhar_website_writer;
grant insert on ibhar_website.quote_requests to ibhar_website_writer;
create policy website_insert_only on ibhar_website.quote_requests
  for insert to ibhar_website_writer with check (status = 'new');
create index website_quote_requests_created_idx
  on ibhar_website.quote_requests (created_at desc);
alter role ibhar_website_writer set statement_timeout = '5s';
alter role ibhar_website_writer set lock_timeout = '2s';
alter role ibhar_website_writer set idle_in_transaction_session_timeout = '5s';
-- LOGIN/password provisioning is deliberately separate; no credential in source.
-- Do not grant membership in anon, authenticated, service_role or postgres.
-- Keep this schema outside the exposed Data API schema list.
commit;
