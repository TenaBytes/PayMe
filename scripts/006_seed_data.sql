-- Insert default investment packages
insert into public.investment_packages (name, description, min_amount, max_amount, apy_rate, duration_days, currency) values
('USDT Starter', 'Perfect for beginners - Low risk, steady returns', 100, 1000, 8.5, 30, 'USDT'),
('USDT Growth', 'Balanced growth package with competitive returns', 1000, 10000, 12.0, 60, 'USDT'),
('USDT Premium', 'High-yield investment for experienced investors', 10000, 100000, 15.5, 90, 'USDT'),
('TRX Basic', 'Entry-level TRX staking package', 1000, 10000, 10.0, 45, 'TRX'),
('TRX Advanced', 'Advanced TRX staking with higher returns', 10000, 100000, 14.0, 90, 'TRX');

-- Insert system settings
insert into public.system_settings (key, value, description) values
('platform_fee', '{"deposit": 0, "withdrawal": 0.5, "investment": 0}', 'Platform fees in percentage'),
('min_withdrawal', '{"USDT": 10, "TRX": 100}', 'Minimum withdrawal amounts'),
('max_withdrawal_daily', '{"USDT": 50000, "TRX": 500000}', 'Maximum daily withdrawal limits'),
('kyc_required', 'true', 'Whether KYC verification is required'),
('maintenance_mode', 'false', 'Platform maintenance status');
