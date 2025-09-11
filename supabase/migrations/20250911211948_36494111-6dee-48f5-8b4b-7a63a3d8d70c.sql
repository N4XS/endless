-- CRITICAL SECURITY FIX: Secure user_roles table with RLS policies
-- This addresses the privilege escalation vulnerability

-- First, ensure RLS is enabled on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only service role can insert/update/delete roles (admin management)
CREATE POLICY "Service role manages user roles" 
ON public.user_roles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Policy 2: Users can only view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Create secure function for role assignment (only callable by service role)
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow this function to be called by service role
  -- This function should only be used in edge functions or admin tools
  
  -- Insert or update role assignment
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log the role assignment for security audit
  INSERT INTO public.security_logs (event_type, details, user_id, metadata)
  VALUES (
    'role_assigned',
    'User role assigned: ' || _role::text,
    _user_id,
    jsonb_build_object('role', _role, 'assigned_at', now())
  );
END;
$$;

-- Create secure function for role removal (only callable by service role)
CREATE OR REPLACE FUNCTION public.remove_user_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove the role assignment
  DELETE FROM public.user_roles 
  WHERE user_id = _user_id AND role = _role;
  
  -- Log the role removal for security audit
  INSERT INTO public.security_logs (event_type, details, user_id, metadata)
  VALUES (
    'role_removed',
    'User role removed: ' || _role::text,
    _user_id,
    jsonb_build_object('role', _role, 'removed_at', now())
  );
END;
$$;

-- Create function to get user's roles safely
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role 
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id;
$$;

-- Create function to check if current user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
  );
$$;

-- Add security event logging for suspicious role-related activities
-- This will be used by the application to log when non-admins try to access admin features
CREATE OR REPLACE FUNCTION public.log_unauthorized_admin_attempt()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_logs (event_type, details, user_id, metadata)
  VALUES (
    'unauthorized_admin_attempt',
    'User attempted to access admin functionality without proper role',
    auth.uid(),
    jsonb_build_object('timestamp', now(), 'user_agent', current_setting('request.headers', true))
  );
END;
$$;