-- Update STARZZ product price to 1470€ (147000 cents)
UPDATE products 
SET price_cents = 147000 
WHERE slug = 'starzz' OR name = 'STARZZ';