-- Update STARZZ tent price to 1249€
UPDATE public.products 
SET price_cents = 124900, updated_at = now()
WHERE id = '6805191a-5757-4d22-92e0-cc9709dc6d8b';