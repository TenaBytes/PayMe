-- Create loans table for loan insurance feature
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  requested_amount DECIMAL(20,8) NOT NULL,
  collateral_amount DECIMAL(20,8) NOT NULL,
  collateral_coin TEXT NOT NULL CHECK (collateral_coin IN ('USDT', 'TRX')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'repaid')),
  interest_rate DECIMAL(5,2) DEFAULT 5.00, -- 5% default
  repayment_date DATE,
  admin_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: collateral must be at least 50% of requested amount
  CONSTRAINT collateral_minimum CHECK (collateral_amount >= requested_amount * 0.5)
);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own loans" ON loans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loans" ON loans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all loans" ON loans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
