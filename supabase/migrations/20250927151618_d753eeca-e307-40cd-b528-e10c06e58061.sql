-- Add END15 discount code
INSERT INTO public.discount_codes (
  code,
  type,
  value,
  description,
  min_order_cents,
  max_uses,
  valid_from,
  valid_until,
  active
) VALUES (
  'END15',
  'percentage',
  15,
  'Réduction de fin de période - 15% de réduction sur votre commande',
  0,
  NULL,
  NOW(),
  NULL,
  true
);