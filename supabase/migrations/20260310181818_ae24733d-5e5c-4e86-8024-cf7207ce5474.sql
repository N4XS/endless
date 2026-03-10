UPDATE public.products 
SET 
  slug = 'starzz-edition-2026',
  description = 'La STARZZ Édition 2026 a été repensée pour être plus robuste, plus rapide à déplier et replier. Sans extension recouvrant l''échelle, elle offre désormais deux points de vue. La housse lavable du matelas a été entièrement redessinée pour une manipulation bien plus facile. Compacité et confort pour vos escapades en couple ou entre amis.',
  features = ARRAY[
    'Édition 2026 : plus robuste grâce à des renforts structurels supplémentaires',
    'Dépliage et repliage encore plus rapide que la version précédente',
    'Double point de vue sans extension recouvrant l''échelle',
    'Housse lavable du matelas repensée, beaucoup plus facile à manipuler',
    'Toile résistante et aérée en Poly-Coton de haute qualité 280g/m²',
    'Fenêtre offrant une vue sur les étoiles en étant protégé des éléments',
    'Plancher en aluminium, ultra résistant et léger',
    'Matelas en mousse haute densité de 8cm d''épaisseur',
    'Matelas anti-condensation intégré dans la tente',
    'Sac à chaussures pratique inclus',
    'Plusieurs poches intérieures pour ranger vos effets personnels',
    'Moustiquaires à toutes les fenêtres',
    'Bâche de protection en PVC avec possibilité de la rouler',
    'Fermetures éclairs SBS ultra résistantes',
    'Échelle one-click, ajustable à la hauteur du véhicule'
  ],
  updated_at = now()
WHERE id = '6805191a-5757-4d22-92e0-cc9709dc6d8b';