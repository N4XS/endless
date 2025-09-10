# Changelog

## v2.1.0 - Améliorations de Sécurité 🔒

### Sécurité renforcée
- **Token d'accès invité** : Génération de tokens cryptographiquement sécurisés pour l'accès aux commandes invitées
- **Nouvelle fonction Edge `get-order`** : Récupération sécurisée des commandes via token (remplace l'accès par email)
- **En-têtes CORS améliorés** : Ajout de `Access-Control-Max-Age` et méthodes HTTP autorisées
- **Nettoyage automatique** : Suppression des tokens temporaires du localStorage après utilisation

### Nouvelles fonctionnalités
- Fonction Edge `get-order` publique pour récupérer les détails de commande de façon sécurisée
- Migration base de données : ajout de la colonne `guest_access_token` dans `orders`
- Gestion d'erreur améliorée pour les commandes introuvables

---

# Changelog - Animations Framer Motion

## Nouvelles fonctionnalités ✨

### Système d'animations
- **Framer Motion** intégré avec variants réutilisables
- **Reveals au scroll** avec stagger léger
- **Transitions de route** fluides avec AnimatePresence
- **Micro-interactions** sur boutons et cartes
- **Respect de prefers-reduced-motion**

### Composants animés
- `MotionWrapper` - Wrapper générique pour animations
- `ScrollReveal` - Animations déclenchées au scroll
- `LazyImage` - Images lazy avec animations de chargement
- `AnimatedRoutes` - Gestion des transitions de page

### Variants disponibles
```typescript
// Animations d'entrée
fadeIn, fadeUp, scaleIn
slideInLeft, slideInRight

// Containers
staggerContainer - pour des animations en cascade

// Page transitions
pageTransition - pour les changements de route

// Micro-interactions
buttonHover, buttonTap, cardHover
```

### Menu mobile animé
- Animations d'ouverture/fermeture avec AnimatePresence
- Stagger des éléments de navigation
- Transitions fluides

### Code splitting
- Pages chargées avec React.lazy
- Suspense avec spinner de chargement
- Optimisation du bundle

## Optimisations 🚀

### Images
- Lazy loading natif
- Animations de fondu au chargement
- Fallback pour erreurs d'image

### Performance
- Animations désactivées si prefers-reduced-motion
- Code splitting par page
- Tree shaking de Framer Motion

### Responsive design
- Testé sur 360px, 768px, 1024px, 1440px
- Animations adaptées aux mobiles
- Touch-friendly interactions

## Structure technique 🏗️

### Nouveaux fichiers
```
src/
├── lib/motion.ts           # Variants Framer Motion
├── hooks/useReducedMotion.ts # Hook accessibilité
├── components/
│   ├── MotionWrapper.tsx   # Wrapper générique
│   ├── ScrollReveal.tsx    # Animations au scroll
│   ├── LazyImage.tsx       # Images optimisées
│   └── AnimatedRoutes.tsx  # Routing animé
```

### Composants mis à jour
- `Button` - Micro-interactions hover/tap
- `ProductCard` - Animations hover et lazy images
- `Header` - Menu mobile animé
- `Hero` - Reveals au scroll
- `App` - Nouvelle structure avec AnimatedRoutes

## Accessibilité ♿
- Respect de `prefers-reduced-motion`
- Fallback sans animations
- Maintien de la navigation au clavier
- Contraste et lisibilité préservés

## Performance 📊
- Bundle splitté par page
- Lazy loading des images
- Animations GPU-accelerated
- Tree shaking optimal