-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  country text,
  balance_usdt decimal(20,8) default 0.00000000,
  balance_trx decimal(20,8) default 0.00000000,
  referral_code text unique not null,
  referred_by uuid references public.profiles(id),
  referral_count integer default 0,
  total_referral_earnings decimal(20,8) default 0.00000000,
  last_wheel_spin date,
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  kyc_documents jsonb,
  is_admin boolean default false,
  wallet_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admin policies
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Added referral code generation function
create or replace function generate_referral_code()
returns text
language plpgsql
security definer
as $$
declare
  code text;
  exists_check boolean;
begin
  loop
    -- Generate 8 character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    select exists(select 1 from public.profiles where referral_code = code) into exists_check;
    
    -- Exit loop if code is unique
    if not exists_check then
      exit;
    end if;
  end loop;
  
  return code;
end;
$$;
