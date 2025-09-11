-- SECURITY FIX: Restrict guest access to orders to prevent email exposure
-- This addresses the customer email exposure vulnerability

-- First, drop the overly permissive guest access policy
DROP POLICY IF EXISTS "Allow guest access to orders via token" ON public.orders;

-- Create a secure function that returns only safe order data for guest access
CREATE OR REPLACE FUNCTION public.get_guest_order_details(order_id uuid, token text)
RETURNS TABLE(
  id uuid,
  amount_cents integer,
  shipping_cost_cents integer,
  currency text,
  status text,
  shipping_country text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.id,
    o.amount_cents,
    o.shipping_cost_cents,
    o.currency,
    o.status,
    o.shipping_country,
    o.created_at,
    o.updated_at
  FROM orders o
  WHERE o.id = order_id 
    AND o.guest_access_token = token
    AND o.guest_access_token IS NOT NULL
    AND char_length(o.guest_access_token) = 64
    AND o.user_id IS NULL;
$$;

-- Create a more restrictive guest access policy that uses the secure function
-- This policy will never expose sensitive fields like customer_email
CREATE POLICY "Restricted guest access to orders via secure function" 
ON public.orders 
FOR SELECT 
USING (
  -- Only allow access through the secure function by checking if the request
  -- comes from a context where the guest token has been validated
  EXISTS (
    SELECT 1 
    WHERE can_access_order_as_guest(id, guest_access_token) = true
    AND user_id IS NULL
  )
  -- Additional safety: this policy will be bypassed by the secure function anyway
  AND false
);

-- Update the existing can_access_order_as_guest function to be more explicit about security
CREATE OR REPLACE FUNCTION public.can_access_order_as_guest(order_id uuid, token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.id = order_id 
    AND o.guest_access_token = token
    AND o.guest_access_token IS NOT NULL
    AND char_length(o.guest_access_token) = 64
    AND o.user_id IS NULL
  );
$$;

-- Add security logging for guest order access attempts
CREATE OR REPLACE FUNCTION public.log_guest_order_access(order_id uuid, success boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_logs (event_type, details, metadata)
  VALUES (
    'guest_order_access',
    CASE 
      WHEN success THEN 'Guest successfully accessed order details'
      ELSE 'Failed guest order access attempt'
    END,
    jsonb_build_object(
      'order_id', order_id,
      'success', success,
      'timestamp', now(),
      'user_agent', current_setting('request.headers', true)
    )
  );
END;
$$;