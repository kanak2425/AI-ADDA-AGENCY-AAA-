create table if not exists public.agency_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  instagram text check (instagram is null or char_length(instagram) <= 120),
  github text check (github is null or char_length(github) <= 200),
  website_type text not null check (char_length(trim(website_type)) between 1 and 100),
  message text check (message is null or char_length(message) <= 3000),
  source text not null default 'ai-adda-agency-portfolio',
  created_at timestamptz not null default now()
);

alter table public.agency_leads enable row level security;
revoke all on table public.agency_leads from anon, authenticated, service_role;
grant insert on table public.agency_leads to service_role;
