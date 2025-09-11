-- Harden security for security_logs table
-- First enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Revoke direct access from public roles
REVOKE ALL ON TABLE public.security_logs FROM anon;
REVOKE ALL ON TABLE public.security_logs FROM authenticated;

-- Drop existing policies for this table only  
DROP POLICY IF EXISTS "Service role can manage security logs" ON public.security_logs;

-- Create no new policies - only service role (which bypasses RLS) can access
-- This ensures security_logs are only accessible to administrators/service role