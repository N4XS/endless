import { Product, Testimonial, FAQ } from '@/types';

// Données exemple pour les tentes de toit
// Données exemple pour les tentes de toit
export const products: Product[] = [
  {
    id: "starzz",
    name: "STARZZ",
    slug: "starzz",
    price: 1470,
    currency: "EUR",
    category: "tent",
    badges: ["Hard-shell", "Best-seller"],
    specs: {
      sleeping: "2 - 3",
      shell: "hard",
      weightKg: 59,
      closedSize: "140x120x40cm",
      openSize: "140x240x125cm",
      materials: ["Aluminium", "Poly-Coton 280g/m²"],
      compatibility: "Barres de toit 65kg min",
      maxLoad: "350kg"
    },
    images: [
      "/images/ST-camp.jpg",
      "/images/ST1.jpg",
      "/images/ST2.jpg", 
      "/images/ST3.jpg",
      "/images/ST4.jpg",
      "/images/ST5.jpg",
      "/images/ST6.jpg",
      "/images/ST7.jpg",
      "/images/ST8.jpg",
      "/images/ST9.jpg",
      "/images/ST10.jpg"
    ],
    stock: "in_stock",
    sku: "STARZZ-001",
    description: "La tente de toit STARZZ a été imaginée par notre équipe passionnée par ce type de voyage. Elle allie compacité et confort pour vos escapades en couple ou entre amis. Une toile résistante et aérée en Poly-Coton de haute qualité avec une fenêtre offrant une vue sur les étoiles.",
    features: [
      "Toile résistante et aérée en Poly-Coton de haute qualité 280g/m²",
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
      maxLoad: "350kg",
      material: "Poly-Coton respirant 280g/m²",
      warranty: "Garantie constructeur 2 ans",
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
    question: "Pourquoi choisir la tente STARZZ ?",
    answer: "La STARZZ combine un plancher dur avec une toile souple pour un confort optimal. Elle se déploie en seulement 60 secondes et offre un confort exceptionnel pour 2-3 personnes avec ses matériaux premium (Poly-Coton 280g/m²). Le matelas haute densité 8cm et la fenêtre étoiles en font la tente idéale pour le glamping.",
    category: "choix"
  },
  {
    id: "2", 
    question: "Mon véhicule peut-il supporter la tente STARZZ ?",
    answer: "Oui, le toit de la voiture peut être suffisamment solide pour une tente de toit, à condition de respecter les charges indiquées par le constructeur. Distinguez bien la charge dynamique (véhicule en mouvement) de la charge statique (véhicule à l'arrêt). La charge dynamique acceptée se situe souvent entre 50 et 100 kg. Nos tentes pèsent 59 kg : assurez-vous donc que la charge dynamique de votre toit est d'au moins 59 kg. À l'arrêt, la charge statique admissible est bien plus élevée ; la structure du toit est en réalité conçue pour supporter le véhicule en position renversée.",
    category: "technique"
  },
  {
    id: "3",
    question: "Comment fonctionne la location avant achat ?",
    answer: "Testez la STARZZ avec nos nouveaux tarifs attractifs. Si elle vous plaît, le montant de la location est intégralement déduit de votre achat ! Récupération dans notre entrepôt à Namur (pas de showroom), ou livraison possible en Belgique avec installation comprise.",
    category: "location"
  },
  {
    id: "4",
    question: "Quelles sont les garanties et le service après-vente ?",
    answer: "Garantie & Sérénité incluse : garantie constructeur 2 ans. Service après-vente assuré par notre équipe belge. Installation comprise dans le prix et formation offerte. Pièces détachées disponibles.",
    category: "service"
  },
  {
    id: "5",
    question: "Quels sont les équipements inclus avec la STARZZ ?",
    answer: "Tout est inclus : matelas haute densité 8cm avec housse lavable, matelas anti-condensation, échelle 'one-click' ajustable, sac à chaussures, moustiquaires, bâche PVC, fermetures SBS ultra-résistantes, et l'extension qui recouvre l'échelle pour plus d'espace.",
    category: "service"
  }
];