-- Secure security_logs with RLS and admin-only visibility
-- 1) Enable RLS and revoke broad privileges (idempotent-safe)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.security_logs FROM anon;
REVOKE ALL ON TABLE public.security_logs FROM authenticated;

-- 2) Create an enum for app roles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

-- 3) Create user_roles table to assign roles to users (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4) Enable RLS on user_roles (no public policies; access via definer funcs or service role)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5) Function to check roles (SECURITY DEFINER to avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;

-- 6) Harden security_logs policies: only admins can SELECT; no INSERT/UPDATE/DELETE policies
DROP POLICY IF EXISTS "Admins can view security logs" ON public.security_logs;
CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Note: Service role bypasses RLS and will be used by the Edge Function to insert logs.
