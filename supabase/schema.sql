-- Tiltshield MVP schema (Supabase / PostgreSQL)
-- Run in Supabase SQL editor when ready to enable accounts + persistence.

create table if not exists profiles (
  id uuid references auth.users primary key,
  created_at timestamptz default now(),
  display_name text,
  readiness_score int default 0,
  subscription_status text default 'free',
  assessment_completed boolean default false
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  emergency_fund_months numeric,
  income_sources int,
  has_offline_docs boolean,
  cloud_dependency int,
  emergency_supply_weeks numeric,
  offline_contacts boolean,
  phone_backup_plan boolean,
  alt_payment_method boolean,
  monthly_expenses numeric,
  food_buffer_days numeric
);

create table if not exists category_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  assessment_id uuid references assessments(id) on delete set null,
  money int,
  food int,
  digital int,
  communication int,
  documents int,
  skills int,
  home int,
  emergency int,
  overall int,
  updated_at timestamptz default now()
);

create table if not exists vulnerabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  assessment_id uuid references assessments(id) on delete cascade,
  rank int,
  category text,
  title text,
  severity text,
  current_state text,
  next_action text,
  target text,
  difficulty text,
  impact text,
  is_resolved boolean default false
);

create table if not exists action_library (
  id uuid primary key default gen_random_uuid(),
  category text,
  title text,
  description text,
  why text,
  time_estimate text,
  steps jsonb,
  difficulty text
);

create table if not exists user_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  action_id uuid references action_library(id),
  status text default 'pending',
  completed_at timestamptz,
  notes text
);

alter table profiles enable row level security;
alter table assessments enable row level security;
alter table category_scores enable row level security;
alter table vulnerabilities enable row level security;
alter table user_actions enable row level security;

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users own assessments" on assessments
  for all using (auth.uid() = user_id);

create policy "Users own scores" on category_scores
  for all using (auth.uid() = user_id);

create policy "Users own vulnerabilities" on vulnerabilities
  for all using (auth.uid() = user_id);

create policy "Users own actions" on user_actions
  for all using (auth.uid() = user_id);
