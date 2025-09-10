-- Security enhancement: add guest access token to orders for secure guest retrieval
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS guest_access_token TEXT UNIQUE;

COMMENT ON COLUMN public.orders.guest_access_token IS 'Unique token to retrieve guest orders securely via edge function.';