-- Fix RLS security for orders table
-- Prevent public access to sensitive customer data including emails, payment data, and tokens

-- First, check existing policies and drop/recreate them with proper security
DROP POLICY IF EXISTS "Users can view their own authenticated orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;

-- Create secure policies for orders table
-- 1. Service role policy (for backend operations and edge functions)
CREATE POLICY "Service role can manage orders" 
ON public.orders 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- 2. Authenticated users can only view their own orders
CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- 3. Authenticated users can only update their own orders (for status updates if needed)
CREATE POLICY "Authenticated users can update their own orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. NO access for anonymous users to orders table
-- Guest orders must only be accessed via secure edge functions with proper token validation
-- This prevents public harvesting of customer emails, payment data, and access tokens

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
        WHERE pc.relname = 'orders' 
        AND pn.nspname = 'public'
        AND pol.polname NOT IN ('Service role can manage orders', 'Authenticated users can view their own orders', 'Authenticated users can update their own orders')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', pol_record.polname);
        RAISE NOTICE 'Dropped potentially insecure policy: %', pol_record.polname;
    END LOOP;
END $$;