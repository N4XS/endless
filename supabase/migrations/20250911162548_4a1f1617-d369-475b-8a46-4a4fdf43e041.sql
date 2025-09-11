-- Fix RLS security for order_items table
-- Ensure order items are only accessible by authorized users

-- First, check existing policies and drop/recreate them with proper security
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Service role can manage order items" ON public.order_items;

-- Create secure policies for order_items
-- 1. Service role policy (for backend operations)
CREATE POLICY "Service role can manage order items" 
ON public.order_items 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- 2. Authenticated users can only view items from their own orders
CREATE POLICY "Authenticated users can view their own order items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 3. No access for anonymous users to order items
-- (Removing any potential anon access - guest orders should be accessed via edge functions only)

-- Ensure no other policies allow public access
-- Check for and remove any policies that might allow anon role access
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    -- Check for policies that might allow anon access
    FOR pol_record IN 
        SELECT pol.polname 
        FROM pg_policy pol
        JOIN pg_class pc ON pol.polrelid = pc.oid
        JOIN pg_namespace pn ON pc.relnamespace = pn.oid
        WHERE pc.relname = 'order_items' 
        AND pn.nspname = 'public'
        AND pol.polname NOT IN ('Service role can manage order items', 'Authenticated users can view their own order items')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.order_items', pol_record.polname);
        RAISE NOTICE 'Dropped potentially insecure policy: %', pol_record.polname;
    END LOOP;
END $$;