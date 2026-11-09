create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login timestamptz
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  created_by uuid references auth.users(id),
  status text not null default 'pending' check (status in ('pending', 'used', 'revoked', 'expired')),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  event_type text not null default 'login',
  app_name text not null default 'JEE NEXUS',
  created_at timestamptz not null default now()
);

create table if not exists public.study_records (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  type text not null,
  title text,
  chapter text,
  topic text,
  status text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.login_events enable row level security;
alter table public.study_records enable row level security;

create policy "profile_self_view" on public.profiles
for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "profile_self_update" on public.profiles
for update using (auth.uid() = id);

create policy "admin_invitation_policy" on public.invitations
for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "study_records_self_select" on public.study_records
for select using (auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "study_records_self_insert" on public.study_records
for insert with check (auth.uid() = user_id);

create policy "study_records_self_update" on public.study_records
for update using (auth.uid() = user_id);

create policy "study_records_self_delete" on public.study_records
for delete using (auth.uid() = user_id);

create policy "admin_login_events_read" on public.login_events
for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user')
  on conflict (id) do update set email = excluded.email, full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.record_login_event(p_email text, p_user_id uuid, p_app text)
returns void
language sql
security definer
as $$
  insert into public.login_events (user_id, email, event_type, app_name)
  values (p_user_id, p_email, 'login', p_app);

  update public.profiles
  set last_login = now(), updated_at = now()
  where id = p_user_id;
$$;
