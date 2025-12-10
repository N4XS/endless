-- Add RLS policies for discount_codes requiring admin role for write operations

-- Policy for INSERT - only admins can create discount codes
CREATE POLICY "Admins can insert discount codes"
ON public.discount_codes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy for UPDATE - only admins can update discount codes
CREATE POLICY "Admins can update discount codes"
ON public.discount_codes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy for DELETE - only admins can delete discount codes
CREATE POLICY "Admins can delete discount codes"
ON public.discount_codes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));