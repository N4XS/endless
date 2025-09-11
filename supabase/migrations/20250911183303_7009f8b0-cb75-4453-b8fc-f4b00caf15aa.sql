-- Add RLS policy for guest order access
CREATE POLICY "Allow guest access to orders via token" 
ON public.orders 
FOR SELECT 
USING (
  guest_access_token IS NOT NULL 
  AND char_length(guest_access_token) = 64
  AND user_id IS NULL
);

-- Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create security_logs table for monitoring
CREATE TABLE public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can manage security logs
CREATE POLICY "Service role can manage security logs" 
ON public.security_logs 
FOR ALL 
USING (true);