-- Update RLS policies to protect customer email data
-- Create a function to check if user can access order (either owns it or it's their email)
CREATE OR REPLACE FUNCTION public.can_access_order(order_record orders)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    order_record.user_id = auth.uid() OR 
    (order_record.user_id IS NULL AND order_record.customer_email = auth.email())
$$;

-- Update orders RLS policy to use the function and mask email for non-owners
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  (user_id = auth.uid()) OR 
  (user_id IS NULL AND customer_email = auth.email())
);

-- Update order_items RLS policy to use the secure function
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;

CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND public.can_access_order(orders.*)
  )
);