-- ============================================================
-- TILTSHIELD — Full migration (safe to re-run)
-- Paste entire file into Supabase → SQL Editor → Run
-- ============================================================

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
  severity text,
  title text,
  current_state text,
  next_action text,
  target text,
  difficulty text,
  impact text,
  is_resolved boolean default false
);

create table if not exists user_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  action_id uuid,
  status text default 'pending',
  completed_at timestamptz,
  notes text
);

alter table assessments add column if not exists monthly_income numeric;
alter table assessments add column if not exists offline_value_store int;
alter table assessments add column if not exists digital_payment_dependency int;
alter table assessments add column if not exists food_source_diversity boolean;
alter table assessments add column if not exists has_med_kit boolean;
alter table assessments add column if not exists has_local_vendors boolean;
alter table assessments add column if not exists has_hard_assets boolean;
alter table assessments add column if not exists answers_json jsonb;
alter table assessments add column if not exists member_id uuid;
alter table assessments add column if not exists overall_score int;

create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  relationship text default 'self',
  is_primary boolean default false,
  readiness_score int default 0,
  created_at timestamptz default now()
);

create index if not exists family_members_owner_idx on family_members(owner_id);
create index if not exists assessments_user_created_idx on assessments(user_id, created_at desc);
create index if not exists category_scores_user_updated_idx on category_scores(user_id, updated_at desc);

alter table profiles enable row level security;
alter table assessments enable row level security;
alter table category_scores enable row level security;
alter table vulnerabilities enable row level security;
alter table user_actions enable row level security;
alter table family_members enable row level security;

drop policy if exists "Users read own profile" on profiles;
drop policy if exists "Users update own profile" on profiles;
drop policy if exists "Users insert own profile" on profiles;
drop policy if exists "Users own assessments" on assessments;
drop policy if exists "Users own scores" on category_scores;
drop policy if exists "Users own vulnerabilities" on vulnerabilities;
drop policy if exists "Users own actions" on user_actions;
drop policy if exists "family_members_own" on family_members;

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users own assessments" on assessments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own scores" on category_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own vulnerabilities" on vulnerabilities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own actions" on user_actions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "family_members_own" on family_members
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

do $$ begin
  alter table assessments
    add constraint assessments_member_fk
    foreign key (member_id) references family_members(id) on delete set null;
exception when duplicate_object then null;
end $$;
