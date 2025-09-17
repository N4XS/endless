// Types pour l'application de tentes de toit belge

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: "EUR";
  category: "tent" | "accessory";
  badges?: string[];
  specs: {
    sleeping: number | string;
    shell: "hard" | "soft";
    weightKg: number;
    closedSize: string;
    openSize: string;
    materials?: string[];
    compatibility?: string;
    maxLoad?: string;
  };
  images: string[];
  stock: number;
  sku?: string;
  description?: string;
  features?: string[];
  technicalSpecs?: {
    maxLoad?: string;
    material?: string;
    warranty?: string;
    delivery?: string;
  };
}

export interface RentalRequest {
  productId: string;
  startDate: string;
  endDate: string;
  options: {
    insurance: boolean;
    annex: boolean;
  };
  deposit: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  category: string;
  readTime: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FilterState {
  sleeping?: number[];
  shell?: string[];
  weight?: string[];
  price?: [number, number];
  availability?: string[];
  brand?: string[];
}

export interface SortOption {
  value: string;
  label: string;
}