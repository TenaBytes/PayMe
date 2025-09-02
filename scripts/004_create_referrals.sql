-- Create referrals table for tracking referral relationships and rewards
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_amount DECIMAL(20,8) DEFAULT 0.10000000,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  first_deposit_amount DECIMAL(20,8),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admins can view all referrals" ON referrals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Function to process referral reward
CREATE OR REPLACE FUNCTION process_referral_reward(referred_user_id UUID, deposit_amount DECIMAL) 
RETURNS VOID AS $$
DECLARE
  referrer_user_id UUID;
  reward_amount DECIMAL := 0.10000000;
BEGIN
  -- Get referrer
  SELECT referred_by INTO referrer_user_id 
  FROM profiles 
  WHERE id = referred_user_id AND referred_by IS NOT NULL;
  
  IF referrer_user_id IS NOT NULL THEN
    -- Check if this is first deposit
    IF NOT EXISTS (
      SELECT 1 FROM deposits 
      WHERE user_id = referred_user_id AND status = 'confirmed'
    ) THEN
      -- Create referral record
      INSERT INTO referrals (referrer_id, referred_id, first_deposit_amount)
      VALUES (referrer_user_id, referred_user_id, deposit_amount)
      ON CONFLICT (referrer_id, referred_id) DO NOTHING;
      
      -- Pay reward and update counters
      UPDATE profiles 
      SET 
        balance_usdt = balance_usdt + reward_amount,
        referral_count = referral_count + 1,
        total_referral_earnings = total_referral_earnings + reward_amount
      WHERE id = referrer_user_id;
      
      -- Mark referral as paid
      UPDATE referrals 
      SET status = 'paid', paid_at = NOW()
      WHERE referrer_id = referrer_user_id AND referred_id = referred_user_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;
