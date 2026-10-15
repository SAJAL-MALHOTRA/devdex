create table public.developer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  name text not null,
  role text not null default '',
  location text not null default '',
  bio text not null default '',
  phone text not null,
  email text not null default '',
  website text not null default '',
  github text not null default '',
  linkedin text not null default '',
  x text not null default '',
  availability text not null default '',
  skills text[] not null default '{}',
  projects jsonb not null default '[]',
  experience jsonb not null default '[]',
  education jsonb not null default '[]',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.developer_profiles enable row level security;

create policy "Published profiles are publicly viewable"
  on public.developer_profiles for select
  using (is_published = true);

create policy "Developers can view their own profile"
  on public.developer_profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Developers can create their own profile"
  on public.developer_profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Developers can update their own profile"
  on public.developer_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger developer_profiles_updated_at
  before update on public.developer_profiles
  for each row execute function public.set_updated_at();

grant select on public.developer_profiles to anon, authenticated;
grant insert, update on public.developer_profiles to authenticated;
