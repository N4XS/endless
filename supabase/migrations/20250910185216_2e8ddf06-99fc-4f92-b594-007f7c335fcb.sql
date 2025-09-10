-- Mettre à jour les chemins d'images pour qu'elles pointent vers le dossier public
UPDATE products 
SET images = ARRAY['/images/product-hardshell-tent.jpg'] 
WHERE name = 'STARZZ';