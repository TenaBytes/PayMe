-- Insert sample investment packages
INSERT INTO public.investment_packages (name, description, min_amount, max_amount, roi_percentage, duration_days) VALUES
('Starter Package', 'Perfect for beginners in cryptocurrency investment', 100.00, 1000.00, 5.0, 30),
('Growth Package', 'Balanced risk and reward for steady growth', 1000.00, 10000.00, 8.0, 60),
('Premium Package', 'High-yield investment for experienced investors', 10000.00, 50000.00, 12.0, 90),
('Elite Package', 'Exclusive package for high-net-worth individuals', 50000.00, NULL, 15.0, 120)
ON CONFLICT DO NOTHING;
