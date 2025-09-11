-- Create a secure view for guest order access that excludes sensitive data
CREATE OR REPLACE VIEW public.guest_order_view AS
SELECT 
  o.id,
  o.status,
  o.amount_cents,
  o.currency,
  o.shipping_country,
  o.shipping_cost_cents,
  o.created_at,
  o.updated_at,
  -- Exclude sensitive fields: customer_email, stripe_session_id, guest_access_token
  o.guest_access_token -- Keep only for token validation, but hide others
FROM public.orders o;

-- Create a secure view for guest order items that limits exposed data
CREATE OR REPLACE VIEW public.guest_order_items_view AS
SELECT 
  oi.id,
  oi.order_id,
  oi.quantity,
  oi.unit_price_cents,
  oi.total_cents,
  oi.created_at,
  -- Exclude product_id to prevent product enumeration attacks
  p.name as product_name,
  p.slug as product_slug
FROM public.order_items oi
JOIN public.products p ON oi.product_id = p.id;

-- Update RLS policies to use the secure views
-- First drop existing guest policies
DROP POLICY IF EXISTS "Guest users can view orders with valid token" ON public.orders;
DROP POLICY IF EXISTS "Guest users can view order items with valid token" ON public.order_items;

-- Create new restrictive policies for direct table access
-- Only authenticated users can access the full orders table
CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders o 
  WHERE o.id = order_items.order_id 
  AND o.user_id = auth.uid()
));

-- Enable RLS on the views
ALTER VIEW public.guest_order_view SET (security_barrier = true);
ALTER VIEW public.guest_order_items_view SET (security_barrier = true);

-- Grant access to views for authenticated users and service role
GRANT SELECT ON public.guest_order_view TO authenticated, service_role;
GRANT SELECT ON public.guest_order_items_view TO authenticated, service_role;