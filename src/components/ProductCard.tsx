import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Users, Weight } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getShellIcon = (shell: 'hard' | 'soft') => {
    return shell === 'hard' ? '🛡️' : '🏕️';
  };

  return (
    {/* 1) Retire la contrainte max-w-5xl (et éventuellement mx-auto) */}
    <div className={cn("w-full max-w-none group", className)}>
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hero transition-all duration-300 border border-border">
        
        {/* 2) Passe en 12 colonnes et 3) Donne plus d’espace au contenu */}
        <div className="grid md:grid-cols-12 gap-0 min-h-[400px]">
          {/* Image Section — 5 colonnes */}
          <div className="relative md:col-span-5 aspect-[4/3] md:aspect-auto h-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-3 bg-background/95 backdrop-blur rounded-full shadow-soft hover:bg-background hover:shadow-hero transition-all">
                <Heart className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section — 7 colonnes */}
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between min-h-[400px]">
            {/* ... (le reste inchangé) ... */}
          </div>
        </div>
      </div>
    </div>
  );
};