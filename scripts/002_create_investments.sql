-- Create investment packages table
create table if not exists public.investment_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  min_amount decimal(20,8) not null,
  max_amount decimal(20,8),
  apy_rate decimal(5,2) not null, -- Annual percentage yield
  duration_days integer not null,
  currency text default 'USDT' check (currency in ('USDT', 'TRX')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user investments table
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  package_id uuid references public.investment_packages(id) not null,
  amount decimal(20,8) not null,
  currency text not null check (currency in ('USDT', 'TRX')),
  status text default 'active' check (status in ('active', 'completed', 'cancelled')),
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone not null,
  expected_return decimal(20,8) not null,
  actual_return decimal(20,8) default 0,
  transaction_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.investment_packages enable row level security;
alter table public.investments enable row level security;

-- Investment packages policies (public read, admin write)
create policy "Anyone can view active packages"
  on public.investment_packages for select
  using (is_active = true);

create policy "Admins can manage packages"
  on public.investment_packages for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Investments policies
create policy "Users can view own investments"
  on public.investments for select
  using (auth.uid() = user_id);

create policy "Users can create own investments"
  on public.investments for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all investments"
  on public.investments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update all investments"
  on public.investments for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Add updated_at triggers
create trigger investment_packages_updated_at
  before update on public.investment_packages
  for each row
  execute function public.handle_updated_at();

create trigger investments_updated_at
  before update on public.investments
  for each row
  execute function public.handle_updated_at();
