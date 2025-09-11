-- Harden security for security_logs: enable RLS, remove public access, and ensure only service role can manage via bypass
-- Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Revoke any direct privileges from anon/authenticated roles (defense in depth)
REVOKE ALL ON TABLE public.security_logs FROM anon;
REVOKE ALL ON TABLE public.security_logs FROM authenticated;

-- Drop any broad policies except we keep none; service role bypasses RLS automatically
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'security_logs' 
      AND policyname = 'Service role can manage security logs'
  ) THEN
    EXECUTE 'DROP POLICY "Service role can manage security logs" ON public.security_logs';
  END IF;
  -- Drop any other policies that might allow public access
  FOR policyname IN 
    SELECT policyname FROM pg_policies 
    WHERE schemaname='public' AND tablename='security_logs'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.security_logs', policyname);
  END LOOP;
END$$;

-- Note: No policies are re-created intentionally. With RLS enabled and no policies,
-- only the service role (which bypasses RLS) can access this table.
