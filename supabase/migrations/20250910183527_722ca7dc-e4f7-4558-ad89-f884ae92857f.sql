-- Corriger les informations de la tente STARZZ avec les vraies données
UPDATE products 
SET 
  name = 'STARZZ',
  description = 'La tente de toit STARZZ a été imaginée par notre équipe passionnée par ce type de voyage. Elle allie compacité et confort pour vos escapades en couple ou entre amis. Une toile résistante et aérée en Poly-Coton de haute qualité avec une fenêtre offrant une vue sur les étoiles.',
  price_cents = 179000, -- 1790€ converti en centimes
  stock = 5, -- Stock disponible
  sku = 'STARZZ-001',
  specs = '{
    "sleeping": 3,
    "shell": "hard",
    "weightKg": 59,
    "closedSize": "140x120x40cm",
    "openSize": "140x240x125cm",
    "materials": ["Aluminium", "Poly-Coton 280rpm"],
    "compatibility": "Barres de toit 65kg min",
    "maxLoad": "275kg"
  }'::jsonb,
  features = ARRAY[
    'Toile résistante et aérée en Poly-Coton de haute qualité 280rpm',
    'Fenêtre offrant une vue sur les étoiles en étant protégé des éléments',
    'Extension recouvrant l''échelle et créant une surface plus importante',
    'Plancher en aluminium, ultra résistant et léger',
    'Matelas en mousse haute densité de 8cm d''épaisseur avec housse lavable',
    'Matelas anti-condensation intégré dans la tente',
    'Sac à chaussures pratique inclus',
    'Plusieurs poches intérieures pour ranger vos effets personnels',
    'Moustiquaires à toutes les fenêtres',
    'Bâche de protection en PVC avec possibilité de la rouler',
    'Fermetures éclairs SBS ultra résistantes',
    'Échelle ''one-click'', ajustable à la hauteur du véhicule'
  ]
WHERE slug = 'starzz';