-- Create function to validate discount code by ID (for payment processing)
CREATE OR REPLACE FUNCTION public.validate_discount_code_by_id(
  discount_id UUID,
  order_amount_cents INTEGER
)
RETURNS TABLE(
  valid BOOLEAN,
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
  -- Find the discount code by ID
  SELECT * INTO discount_record
  FROM discount_codes dc
  WHERE dc.id = discount_id
    AND dc.active = true
    AND (dc.valid_until IS NULL OR dc.valid_until > now())
    AND dc.valid_from <= now();
  
  -- Check if code exists
  IF discount_record.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::INTEGER, 0, 'Code de réduction invalide ou expiré';
    RETURN;
  END IF;
  
  -- Check minimum order amount
  IF order_amount_cents < discount_record.min_order_cents THEN
    RETURN QUERY SELECT false, discount_record.type, discount_record.value, 0, 
      'Montant minimum de commande non atteint: ' || (discount_record.min_order_cents / 100.0)::TEXT || '€';
    RETURN;
  END IF;
  
  -- Check usage limit
  IF discount_record.max_uses IS NOT NULL AND discount_record.used_count >= discount_record.max_uses THEN
    RETURN QUERY SELECT false, discount_record.type, discount_record.value, 0, 'Code de réduction épuisé';
    RETURN;
  END IF;
  
  -- Calculate discount amount
  IF discount_record.type = 'percentage' THEN
    calculated_discount := (order_amount_cents * discount_record.value / 100);
  ELSIF discount_record.type = 'fixed' THEN
    calculated_discount := LEAST(discount_record.value * 100, order_amount_cents); -- Convert euros to cents
  END IF;
  
  -- Return valid discount
  RETURN QUERY SELECT true, discount_record.type, discount_record.value, calculated_discount, 'Code valide';
END;
$$;

-- Add discount tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS discount_code_id UUID,
ADD COLUMN IF NOT EXISTS discount_amount_cents INTEGER DEFAULT 0;