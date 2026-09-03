-- Household invite code + shared plan cloud (safe to re-run)
alter table profiles add column if not exists household_code text;
alter table profiles add column if not exists household_plan jsonb default '[]'::jsonb;

create unique index if not exists profiles_household_code_uidx
  on profiles (household_code)
  where household_code is not null;

-- Allow reading a profile by household_code only for join (via service role API).
-- No public policy needed when join runs with service role.
