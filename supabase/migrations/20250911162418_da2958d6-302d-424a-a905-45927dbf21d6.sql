-- Fix RLS security vulnerability for orders table
-- Remove unsafe email-based access for guest orders
-- Guest orders should only be accessible via secure guest token mechanism

-- Drop existing RLS policy that allows email-based access
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create new secure RLS policy that only allows authenticated users to access their own orders
CREATE POLICY "Users can view their own authenticated orders" 
ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

-- Update the can_access_order function to remove email-based access
CREATE OR REPLACE FUNCTION public.can_access_order(order_record orders)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Only allow access to orders that belong to the authenticated user
  -- Guest orders (user_id IS NULL) should only be accessible via secure guest token mechanism
  SELECT order_record.user_id = auth.uid()
$function$;