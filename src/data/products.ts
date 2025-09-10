import { Product, Testimonial, FAQ } from '@/types';

// Images importées
import hardshellImage from '@/assets/product-hardshell-tent.jpg';
import softshellImage from '@/assets/product-softshell-tent.jpg';
import alpineImage from '@/assets/product-alpine-tent.jpg';

// Données exemple pour les tentes de toit
export const products: Product[] = [
  {
    id: "1",
    name: "Explorer Pro Hard-Shell",
    slug: "explorer-pro-hard-shell",
    price: 2899,
    currency: "EUR",
    category: "tent",
    badges: ["Hard-shell", "Nouveau", "Best-seller"],
    specs: {
      sleeping: 3,
      shell: "hard",
      weightKg: 68,
      closedSize: "145 x 115 x 32 cm",
      openSize: "245 x 145 x 135 cm",
      materials: ["Fibre de verre", "Toile Canvas 280g"],
      compatibility: "Barres de toit universelles"
    },
    images: [
      hardshellImage,
      hardshellImage,
      hardshellImage
    ],
    stock: "in_stock",
    sku: "EPH-001",
    description: "Tente de toit hard-shell premium pour 3 personnes, montage ultra-rapide en 2 minutes.",
    features: [
      "Ouverture automatique assistée par ressorts à gaz",
      "Matelas haute densité 8cm inclus",
      "Toile respirante anti-condensation",
      "Échelle télescopique renforcée"
    ]
  },
  {
    id: "2", 
    name: "Nomad Soft-Shell Familiale",
    slug: "nomad-soft-shell-familiale",
    price: 1899,
    currency: "EUR",
    category: "tent",
    badges: ["Soft-shell", "Familiale"],
    specs: {
      sleeping: 4,
      shell: "soft",
      weightKg: 52,
      closedSize: "140 x 110 x 25 cm",
      openSize: "240 x 140 x 130 cm",
      materials: ["Aluminium", "Toile Ripstop 420D"],
      compatibility: "Barres de toit à partir de 60kg"
    },
    images: [
      softshellImage,
      softshellImage
    ],
    stock: "in_stock",
    sku: "NSF-002",
    description: "Tente de toit soft-shell spacieuse pour famille, excellent rapport qualité-prix.",
    features: [
      "Montage simple en 5 minutes",
      "Double toit étanche 3000mm",
      "Annexe optionnelle disponible",
      "Fenêtres avec moustiquaires intégrées"
    ]
  },
  {
    id: "3",
    name: "Alpine Compact 2P",
    slug: "alpine-compact-2p", 
    price: 1599,
    currency: "EUR",
    category: "tent",
    badges: ["Compact", "Léger"],
    specs: {
      sleeping: 2,
      shell: "hard",
      weightKg: 45,
      closedSize: "120 x 110 x 28 cm",
      openSize: "210 x 120 x 125 cm",
      materials: ["Composite ABS", "Toile technique"],
      compatibility: "Tous véhicules"
    },
    images: [
      alpineImage
    ],
    stock: "in_stock", 
    sku: "AC2-003",
    description: "Tente de toit compacte et légère, parfaite pour les couples aventuriers.",
    features: [
      "Le plus léger de sa catégorie",
      "Design aérodynamique",
      "Ouverture latérale innovante",
      "Compatible petits véhicules"
    ]
  }
];

// Accessoires 
export const accessories: Product[] = [
  {
    id: "acc-1",
    name: "Annexe Confort Pro",
    slug: "annexe-confort-pro",
    price: 599,
    currency: "EUR", 
    category: "accessory",
    badges: ["Imperméable"],
    specs: {
      sleeping: 0,
      shell: "soft",
      weightKg: 8,
      closedSize: "60 x 40 x 15 cm",
      openSize: "240 x 240 x 200 cm",
      materials: ["Toile Ripstop 210D"],
      compatibility: "Tentes soft-shell"
    },
    images: ["/api/placeholder/400/300"],
    stock: "in_stock",
    sku: "ACP-001",
    description: "Annexe spacieuse pour créer un espace de vie supplémentaire.",
    features: ["Montage autonome", "Sol étanche amovible", "Entrées multiples"]
  },
  {
    id: "acc-2", 
    name: "Échelle Télescopique Alu",
    slug: "echelle-telescopique-alu",
    price: 289,
    currency: "EUR",
    category: "accessory",
    badges: ["Sécurité"],
    specs: {
      sleeping: 0,
      shell: "hard",
      weightKg: 6,
      closedSize: "90 x 15 x 15 cm", 
      openSize: "270 x 50 x 15 cm",
      materials: ["Aluminium anodisé"],
      compatibility: "Toutes tentes"
    },
    images: ["/api/placeholder/400/300"],
    stock: "in_stock",
    sku: "ETA-002",
    description: "Échelle télescopique de sécurité avec marches antidérapantes.",
    features: ["Réglage hauteur facile", "Marches larges 8cm", "Crochets sécurisés"]
  }
];

// Témoignages clients
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marc & Sarah L.",
    location: "Bruxelles",
    rating: 5,
    comment: "Explorer Pro parfaite pour nos road trips en famille ! Montage ultra-rapide et confort exceptionnel. Service client belge au top !",
    date: "2024-08-15"
  },
  {
    id: "2", 
    name: "Pierre D.",
    location: "Liège",
    rating: 5,
    comment: "Nomad Soft-Shell depuis 2 ans, aucun problème même sous la pluie battante. Excellent investissement pour découvrir l'Europe !",
    date: "2024-07-22" 
  },
  {
    id: "3",
    name: "Julie & Tom", 
    location: "Gand",
    rating: 5,
    comment: "Location d'une Alpine Compact pour tester avant achat. Conquis dès le premier week-end ! Achetée 2 semaines plus tard.",
    date: "2024-09-02"
  }
];

// FAQ
export const faqs: FAQ[] = [
  {
    id: "1",
    question: "Quelle tente de toit choisir pour débuter ?",
    answer: "Pour débuter, nous recommandons la Nomad Soft-Shell qui offre le meilleur rapport qualité-prix. Elle est facile à monter et convient à la plupart des véhicules. Pour plus de confort, l'Explorer Pro Hard-Shell s'ouvre automatiquement en 2 minutes.",
    category: "choix"
  },
  {
    id: "2", 
    question: "Mon véhicule peut-il supporter une tente de toit ?",
    answer: "La plupart des véhicules avec barres de toit peuvent accueillir une tente. Vérifiez la charge dynamique autorisée (minimum 60kg pour nos tentes les plus légères, 75kg recommandés). Nous proposons un service de vérification gratuit.",
    category: "technique"
  },
  {
    id: "3",
    question: "Comment fonctionne la location ?",
    answer: "Location simple : choisissez vos dates, payez en ligne avec caution. Récupération dans notre showroom près de Bruxelles ou livraison possible. Tente livrée montée sur votre véhicule avec briefing complet.",
    category: "location"
  },
  {
    id: "4",
    question: "Quelle garantie sur les tentes de toit ?",
    answer: "Toutes nos tentes bénéficient d'une garantie constructeur de 3 ans. Service après-vente assuré par notre équipe belge. Pièces détachées disponibles et réparations possibles dans notre atelier.",
    category: "service"
  },
  {
    id: "5",
    question: "Livraison et montage, comment ça marche ?",
    answer: "Livraison gratuite en Belgique dès 200€. Installation possible dans notre showroom ou chez vous (supplément selon distance). Formation montage offerte avec chaque achat.",
    category: "service"
  }
];