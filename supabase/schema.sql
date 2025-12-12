-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ORGANIZATIONS (Tenants)
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  subscription_status text default 'incomplete',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ORGANIZATION MEMBERS (Many-to-Many link between Users and Orgs)
create type public.app_role as enum ('owner', 'manager', 'cleaner');

create table public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role default 'cleaner'::public.app_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- 4. PROPERTIES (Houses/Buildings)
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ROOMS (Units within Properties)
create type public.room_status as enum ('dirty', 'clean', 'inspected', 'occupied');

create table public.rooms (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade,
  name text not null, -- e.g. "305"
  type text, -- e.g. "1BR"
  floor integer,
  section text, -- e.g. "East"
  status room_status default 'dirty'::public.room_status not null,
  last_cleaned_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BOOKINGS (Guest Reservations)
create type public.booking_status as enum ('reserved', 'checked_in', 'checked_out', 'cancelled');

create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  room_id uuid references public.rooms(id) on delete set null,
  channel text, -- PMS, Airbnb, Manual
  source text, -- RMS Cloud, Airbnb, Direct
  checkin_date timestamp with time zone not null,
  checkout_date timestamp with time zone not null,
  pax integer default 1,
  status booking_status default 'reserved'::public.booking_status not null,
  special_requests text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. PMS SYNC EVENTS (Webhook Logs)
create table public.pms_sync_events (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  source text not null, -- RMS, Cloudbeds, Opera, Airbnb
  type text not null, -- room.updated, booking.updated, checkout, checkin
  payload jsonb not null,
  processed boolean default false not null,
  error_log text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. JOBS (Cleaning Tasks)
create type public.job_status as enum ('pending', 'in_progress', 'completed', 'cancelled');

create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  room_id uuid references public.rooms(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  assigned_to uuid references public.profiles(id),
  status job_status default 'pending'::public.job_status not null,
  scheduled_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.properties enable row level security;
alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.pms_sync_events enable row level security;
alter table public.jobs enable row level security;

-- RLS POLICIES

-- Profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Organizations
create policy "Members can view organizations" on public.organizations
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
    )
  );

-- Organization Members
create policy "Members can view other members" on public.organization_members
  for select using (
    exists (
      select 1 from public.organization_members as om
      where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
    )
  );

-- Properties
create policy "Members can view properties" on public.properties
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = properties.organization_id
      and user_id = auth.uid()
    )
  );

create policy "Managers can insert properties" on public.properties
  for insert with check (
    exists (
      select 1 from public.organization_members
      where organization_id = properties.organization_id
      and user_id = auth.uid()
      and role in ('owner', 'manager')
    )
  );

-- Rooms
create policy "Members can view rooms" on public.rooms
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = rooms.organization_id
      and user_id = auth.uid()
    )
  );

create policy "Managers can manage rooms" on public.rooms
  for all using (
    exists (
      select 1 from public.organization_members
      where organization_id = rooms.organization_id
      and user_id = auth.uid()
      and role in ('owner', 'manager')
    )
  );

-- Bookings
create policy "Members can view bookings" on public.bookings
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = bookings.organization_id
      and user_id = auth.uid()
    )
  );

create policy "Managers can manage bookings" on public.bookings
  for all using (
    exists (
      select 1 from public.organization_members
      where organization_id = bookings.organization_id
      and user_id = auth.uid()
      and role in ('owner', 'manager')
    )
  );

-- PMS Sync Events
create policy "Managers can view sync events" on public.pms_sync_events
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = pms_sync_events.organization_id
      and user_id = auth.uid()
      and role in ('owner', 'manager')
    )
  );

-- Jobs
create policy "Members can view jobs" on public.jobs
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = jobs.organization_id
      and user_id = auth.uid()
    )
  );

create policy "Managers can manage jobs" on public.jobs
  for all using (
    exists (
      select 1 from public.organization_members
      where organization_id = jobs.organization_id
      and user_id = auth.uid()
      and role in ('owner', 'manager')
    )
  );

create policy "Cleaners can update assigned jobs" on public.jobs
  for update using (
    assigned_to = auth.uid()
  );

-- FUNCTIONS & TRIGGERS

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
