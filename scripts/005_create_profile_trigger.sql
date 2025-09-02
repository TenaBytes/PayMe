-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert profile
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );

  -- Initialize wallet balances for USDT and TRX
  insert into public.wallet_balances (user_id, currency, available_balance, locked_balance, total_invested, total_returns)
  values 
    (new.id, 'USDT', 0, 0, 0, 0),
    (new.id, 'TRX', 0, 0, 0, 0);

  -- Send welcome notification
  insert into public.notifications (user_id, title, message, type)
  values (
    new.id,
    'Welcome to WealthNexus Platform',
    'Your account has been created successfully. Complete your KYC verification to start investing.',
    'info'
  );

  return new;
end;
$$;

-- Create trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
