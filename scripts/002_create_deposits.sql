-- Create deposits table for tracking crypto deposits
CREATE TABLE IF NOT EXISTS deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coin TEXT NOT NULL CHECK (coin IN ('USDT', 'TRX')),
  amount DECIMAL(20,8) NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  deposit_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  admin_notes TEXT,
  confirmed_by UUID REFERENCES profiles(id),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own deposits" ON deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits" ON deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits" ON deposits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create admin wallets table for deposit addresses
CREATE TABLE IF NOT EXISTS admin_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coin TEXT NOT NULL CHECK (coin IN ('USDT', 'TRX')),
  wallet_address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin wallets
ALTER TABLE admin_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active admin wallets" ON admin_wallets
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage admin wallets" ON admin_wallets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
