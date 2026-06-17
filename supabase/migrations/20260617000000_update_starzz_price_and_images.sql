-- Update STARZZ price to 1589€ (158900 cents) and remove 2nd image
UPDATE products
SET
  price_cents = 158900,
  images = array_remove(images, '/images/ST1.jpg')
WHERE name = 'STARZZ';
