-- Insert sample discount codes for testing
INSERT INTO public.discount_codes (code, type, value, min_order_cents, max_uses, description, active) VALUES
('WELCOME10', 'percentage', 10, 5000, 100, 'Code de bienvenue - 10% de réduction sur commande minimum 50€', true),
('SUMMER50', 'fixed', 50, 10000, 50, 'Réduction été - 50€ sur commande minimum 100€', true),
('VIP20', 'percentage', 20, 0, null, 'Code VIP - 20% de réduction sans minimum', true);