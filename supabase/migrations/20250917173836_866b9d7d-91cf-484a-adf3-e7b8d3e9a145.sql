-- Set Starzz tent to out of stock
UPDATE public.products 
SET stock = 0 
WHERE slug = 'starzz';