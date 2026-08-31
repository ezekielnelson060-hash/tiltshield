-- Tiltshield: family profiles + richer assessment history
-- Run in Supabase SQL editor after base schema.sql

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

alter table family_members enable row level security;

drop policy if exists "family_members_own" on family_members;
create policy "family_members_own" on family_members
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

do $$ begin
  alter table assessments
    add constraint assessments_member_fk
    foreign key (member_id) references family_members(id) on delete set null;
exception when duplicate_object then null;
end $$;

create index if not exists assessments_user_created_idx
  on assessments(user_id, created_at desc);
create index if not exists category_scores_user_updated_idx
  on category_scores(user_id, updated_at desc);
