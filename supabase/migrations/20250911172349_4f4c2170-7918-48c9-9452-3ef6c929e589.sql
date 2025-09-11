-- Remove the problematic guest access policies that expose sensitive data
DROP POLICY IF EXISTS "Guest users can view orders with valid token" ON public.orders;
DROP POLICY IF EXISTS "Guest users can view order items with valid token" ON public.order_items;

-- Create a secure function to check guest access without exposing sensitive data
CREATE OR REPLACE FUNCTION public.can_access_order_as_guest(order_id uuid, token text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.id = order_id 
    AND o.guest_access_token = token
    AND o.guest_access_token IS NOT NULL
    AND char_length(o.guest_access_token) = 64
  );
$$;

-- Add a comment explaining the security approach
COMMENT ON FUNCTION public.can_access_order_as_guest IS 'Securely validates guest access to orders without exposing sensitive customer data. Guest access is now only available through controlled edge functions.';