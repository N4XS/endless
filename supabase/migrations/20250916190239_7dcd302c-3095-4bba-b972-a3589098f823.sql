-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL CHECK (value > 0),
  min_order_cents INTEGER DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active discount codes" 
ON public.discount_codes 
FOR SELECT 
USING (active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Service role can manage discount codes" 
ON public.discount_codes 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to validate and apply discount code
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  code_text TEXT,
  order_amount_cents INTEGER
)
RETURNS TABLE(
  valid BOOLEAN,
  discount_id UUID,
  discount_type TEXT,
  discount_value INTEGER,
  discount_amount_cents INTEGER,
  message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  discount_record discount_codes%ROWTYPE;
  calculated_discount INTEGER := 0;
BEGIN
  -- Find the discount code
  SELECT * INTO discount_record
  FROM discount_codes dc
  WHERE dc.code = UPPER(TRIM(code_text))
    AND dc.active = true
    AND (dc.valid_until IS NULL OR dc.valid_until > now())
    AND dc.valid_from <= now();
  
  -- Check if code exists
  IF discount_record.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::INTEGER, 0, 'Code de réduction invalide';
    RETURN;
  END IF;
  
  -- Check minimum order amount
  IF order_amount_cents < discount_record.min_order_cents THEN
    RETURN QUERY SELECT false, discount_record.id, discount_record.type, discount_record.value, 0, 
      'Montant minimum de commande non atteint: ' || (discount_record.min_order_cents / 100.0)::TEXT || '€';
    RETURN;
  END IF;
  
  -- Check usage limit
  IF discount_record.max_uses IS NOT NULL AND discount_record.used_count >= discount_record.max_uses THEN
    RETURN QUERY SELECT false, discount_record.id, discount_record.type, discount_record.value, 0, 'Code de réduction épuisé';
    RETURN;
  END IF;
  
  -- Calculate discount amount
  IF discount_record.type = 'percentage' THEN
    calculated_discount := (order_amount_cents * discount_record.value / 100);
  ELSIF discount_record.type = 'fixed' THEN
    calculated_discount := LEAST(discount_record.value * 100, order_amount_cents); -- Convert euros to cents
  END IF;
  
  -- Return valid discount
  RETURN QUERY SELECT true, discount_record.id, discount_record.type, discount_record.value, calculated_discount, 'Code appliqué avec succès';
END;
$$;

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_discount_usage(discount_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE discount_codes 
  SET used_count = used_count + 1 
  WHERE id = discount_id;
$$;