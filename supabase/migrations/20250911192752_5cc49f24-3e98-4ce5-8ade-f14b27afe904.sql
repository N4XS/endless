-- Fix security logs access - restrict to service role only
-- Remove any existing permissive policies that might allow public access
DROP POLICY IF EXISTS "Anyone can view security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Public read access to security logs" ON public.security_logs;

-- Ensure RLS is enabled (should already be enabled)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- The existing "Service role can manage security logs" policy is correct
-- But let's make sure no other policies exist that could allow unauthorized access

-- Add a comment to document the security restriction
COMMENT ON TABLE public.security_logs IS 'Contains sensitive security audit information. Access restricted to service role only for security compliance.';