-- Create transactions table for all financial activities
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  investment_id uuid references public.investments(id) on delete set null,
  type text not null check (type in ('deposit', 'withdrawal', 'investment', 'return', 'fee')),
  amount decimal(20,8) not null,
  currency text not null check (currency in ('USDT', 'TRX')),
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  transaction_hash text,
  wallet_address text,
  network text default 'TRC20',
  fee_amount decimal(20,8) default 0,
  description text,
  metadata jsonb,
  processed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wallet balances table
create table if not exists public.wallet_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  currency text not null check (currency in ('USDT', 'TRX')),
  available_balance decimal(20,8) default 0,
  locked_balance decimal(20,8) default 0,
  total_invested decimal(20,8) default 0,
  total_returns decimal(20,8) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, currency)
);

-- Enable RLS
alter table public.transactions enable row level security;
alter table public.wallet_balances enable row level security;

-- Transactions policies
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can create own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update all transactions"
  on public.transactions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Wallet balances policies
create policy "Users can view own balances"
  on public.wallet_balances for select
  using (auth.uid() = user_id);

create policy "Users can update own balances"
  on public.wallet_balances for update
  using (auth.uid() = user_id);

create policy "Users can insert own balances"
  on public.wallet_balances for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all balances"
  on public.wallet_balances for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Add updated_at triggers
create trigger transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.handle_updated_at();

create trigger wallet_balances_updated_at
  before update on public.wallet_balances
  for each row
  execute function public.handle_updated_at();
