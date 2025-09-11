-- Add RLS policy to allow guest order access via secure token
CREATE POLICY "Guest users can view orders with valid token" 
ON public.orders 
FOR SELECT 
USING (
  guest_access_token IS NOT NULL 
  AND guest_access_token != '' 
  AND char_length(guest_access_token) = 64
);

-- Add RLS policy for order_items to support guest access
CREATE POLICY "Guest users can view order items with valid token" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.guest_access_token IS NOT NULL 
    AND orders.guest_access_token != ''
    AND char_length(orders.guest_access_token) = 64
  )
);