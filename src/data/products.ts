import { Product, Testimonial, FAQ } from '@/types';

// Images importées
import hardshellImage from '@/assets/product-hardshell-tent.jpg';
import softshellImage from '@/assets/product-softshell-tent.jpg';
import alpineImage from '@/assets/product-alpine-tent.jpg';

// Données exemple pour les tentes de toit
// Données exemple pour les tentes de toit
export const products: Product[] = [
  {
    id: "starzz",
    name: "STARZZ",
    slug: "starzz",
    price: 1790,
    currency: "EUR",
    category: "tent",
    badges: ["Hard-shell", "Best-seller"],
    specs: {
      sleeping: 2,
      shell: "hard",
      weightKg: 59,
      closedSize: "140x120x40cm",
      openSize: "140x240x125cm",
      materials: ["Aluminium", "Poly-Coton 280rpm"],
      compatibility: "Barres de toit 65kg min",
      maxLoad: "275kg"
    },
    images: [
      hardshellImage,
      hardshellImage,
      hardshellImage
    ],
    stock: "in_stock",
    sku: "STARZZ-001",
    description: "La tente de toit STARZZ a été imaginée par notre équipe passionnée par ce type de voyage. Elle allie compacité et confort pour vos escapades en couple ou entre amis. Une toile résistante et aérée en Poly-Coton de haute qualité avec une fenêtre offrant une vue sur les étoiles.",
    features: [
      "Toile résistante et aérée en Poly-Coton de haute qualité 280rpm",
      "Fenêtre offrant une vue sur les étoiles en étant protégé des éléments", 
      "Extension recouvrant l'échelle et créant une surface plus importante",
      "Plancher en aluminium, ultra résistant et léger",
      "Matelas en mousse haute densité de 8cm d'épaisseur avec housse lavable",
      "Matelas anti-condensation intégré dans la tente",
      "Sac à chaussures pratique inclus",
      "Plusieurs poches intérieures pour ranger vos effets personnels",
      "Moustiquaires à toutes les fenêtres",
      "Bâche de protection en PVC avec possibilité de la rouler",
      "Fermetures éclairs SBS ultra résistantes",
      "Échelle 'one-click', ajustable à la hauteur du véhicule"
    ],
    technicalSpecs: {
      maxLoad: "275kg",
      material: "Poly-Coton respirant 280rpm",
      warranty: "Satisfait ou remboursé 30 jours",
      delivery: "3-5 jours ouvrables"
    }
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
    name: "Sophie et Thomas",
    location: "Écosse",
    rating: 5,
    comment: "Notre road trip en Écosse avec la tente STARZZ a été une révélation. Installation ultra rapide, confort incroyable et liberté totale. Nous ne voyagerons plus jamais autrement !",
    date: "2024-08-15"
  },
  {
    id: "2", 
    name: "Marc",
    location: "Photographe nature",
    rating: 5,
    comment: "En tant que photographe nature, je cherchais une solution pour suivre la lumière. La tente STARZZ m'offre un confort inégalé et me permet de me réveiller aux premières lueurs, prêt à capturer l'instant parfait.",
    date: "2024-07-22" 
  },
  {
    id: "3",
    name: "Famille Dubois", 
    location: "Belgique",
    rating: 5,
    comment: "Avec nos deux enfants, nous redoutions les complications des vacances en camping. La tente STARZZ a transformé nos voyages en moments de pur bonheur. Simple, spacieuse et tellement pratique !",
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