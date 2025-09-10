UPDATE products 
SET images = ARRAY[
  '/images/ST1.jpg', 
  '/images/ST2.jpg',
  '/images/ST3.jpg',
  '/images/ST4.jpg',
  '/images/ST5.jpg',
  '/images/ST6.jpg',
  '/images/ST7.jpg',
  '/images/ST8.jpg',
  '/images/ST9.jpg',
  '/images/ST10.jpg'
]
WHERE slug = 'starzz';