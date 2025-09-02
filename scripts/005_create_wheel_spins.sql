-- Create wheel_spins table for daily lucky wheel feature
CREATE TABLE IF NOT EXISTS wheel_spins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_amount DECIMAL(20,8) NOT NULL,
  spin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, spin_date)
);

-- Enable RLS
ALTER TABLE wheel_spins ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own wheel spins" ON wheel_spins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wheel spins" ON wheel_spins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all wheel spins" ON wheel_spins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Function to spin wheel (server-side validation)
CREATE OR REPLACE FUNCTION spin_wheel(user_uuid UUID) 
RETURNS DECIMAL AS $$
DECLARE
  reward DECIMAL;
  today DATE := CURRENT_DATE;
BEGIN
  -- Check if user already spun today
  IF EXISTS (
    SELECT 1 FROM wheel_spins 
    WHERE user_id = user_uuid AND spin_date = today
  ) THEN
    RAISE EXCEPTION 'Already spun today';
  END IF;
  
  -- Generate random reward (0.01 to 0.12)
  reward := (random() * 0.11 + 0.01)::DECIMAL(20,8);
  
  -- Record spin
  INSERT INTO wheel_spins (user_id, reward_amount, spin_date)
  VALUES (user_uuid, reward, today);
  
  -- Add to user balance
  UPDATE profiles 
  SET balance_usdt = balance_usdt + reward,
      last_wheel_spin = today
  WHERE id = user_uuid;
  
  RETURN reward;
END;
$$ LANGUAGE plpgsql;
