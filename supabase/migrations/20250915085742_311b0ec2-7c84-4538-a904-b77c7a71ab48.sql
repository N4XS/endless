-- Add shipping address columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_line1 text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_line2 text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_city text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_postal_code text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_state text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_phone text;