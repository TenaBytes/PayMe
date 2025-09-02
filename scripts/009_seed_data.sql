-- Seed initial data for the platform

-- Insert default admin wallets (replace with real addresses)
INSERT INTO admin_wallets (coin, wallet_address, created_by) VALUES
('USDT', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', (SELECT id FROM profiles WHERE is_admin = TRUE LIMIT 1)),
('TRX', 'TLPuze2u2dFBHMZaWd4VilkQy6DalD8ZzJ', (SELECT id FROM profiles WHERE is_admin = TRUE LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample news posts
INSERT INTO news (title, content, excerpt, created_by) VALUES
('Welcome to WealthNexus', 'Welcome to our revolutionary crypto investment platform. Start earning today with our secure and transparent system.', 'Welcome to WealthNexus - your gateway to crypto wealth.', (SELECT id FROM profiles WHERE is_admin = TRUE LIMIT 1)),
('New Features Released', 'We have launched exciting new features including the Lucky Wheel and enhanced referral system. Check them out now!', 'New features: Lucky Wheel and enhanced referrals now live.', (SELECT id FROM profiles WHERE is_admin = TRUE LIMIT 1))
ON CONFLICT DO NOTHING;
