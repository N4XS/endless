

## Plan

### 1. Ajouter les 4 nouvelles photos au projet
Copier les images uploadées dans `public/images/` :
- `IMG_4428.jpg` → `public/images/ST-new1.jpg` (position 1)
- `IMG_4399.jpg` → `public/images/ST-new4.jpg` (position 4)
- `IMG_4445.jpg` → `public/images/ST-new7.jpg` (position 7)
- `IMG_4497.jpg` → `public/images/ST-new11.jpg` (position 11 + hero background)

### 2. Mettre a jour le tableau d'images dans `src/data/products.ts`
Remplacer les entrées aux positions 1, 4, 7 et 11 du tableau `images` par les nouveaux fichiers.

Le tableau actuel a 11 images (index 0-10). Les positions demandées :
- Position 1 (index 0) : `/images/ST-new1.jpg`
- Position 4 (index 3) : `/images/ST-new4.jpg`
- Position 7 (index 6) : `/images/ST-new7.jpg`
- Position 11 (index 10) : `/images/ST-new11.jpg`

### 3. Changer le hero de la page Tentes
Dans `src/pages/Tentes.tsx` ligne 139, remplacer `/images/ST1.jpg` par `/images/ST-new11.jpg` (le logo Endless sous la pluie) comme image de fond du hero.

