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
    <div className={cn("card-product group", className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge === 'Nouveau' ? 'default' : 'secondary'}
                className={cn(
                  "text-xs",
                  badge === 'Nouveau' && "bg-ambre text-ambre-foreground",
                  badge === 'Best-seller' && "bg-sapin text-primary-foreground"
                )}
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions rapides */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-background/90 backdrop-blur rounded-full shadow-soft hover:bg-background focus-outdoor">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Stock */}
        <div className="absolute bottom-3 right-3">
          {product.stock === 'out_of_stock' && (
            <Badge variant="destructive" className="text-xs">
              Rupture
            </Badge>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Titre et specs rapides */}
        <div className="space-y-2">
          <Link
            to={`/produit/${product.slug}`}
            className="block group-hover:text-sapin transition-colors"
          >
            <h3 className="font-display font-semibold text-lg line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{product.specs.sleeping}P</span>
            </div>
            <div className="flex items-center gap-1">
              <Weight className="w-4 h-4" />
              <span>{product.specs.weightKg}kg</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{getShellIcon(product.specs.shell)}</span>
              <span className="capitalize">{product.specs.shell}</span>
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-sapin">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">TTC</span>
          </div>
          {product.sku && (
            <span className="text-xs text-muted-foreground">
              Réf: {product.sku}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/produit/${product.slug}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-sapin text-sapin hover:bg-sapin hover:text-primary-foreground"
            >
              Voir détails
            </Button>
          </Link>
          <Button
            size="icon"
            className="bg-sapin hover:bg-sapin/90 text-primary-foreground"
            disabled={product.stock === 'out_of_stock'}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        {/* Lien location si tente */}
        {product.category === 'tent' && (
          <Link to={`/location?product=${product.id}`}>
            <Button
              variant="ghost"
              className="w-full text-olive hover:text-olive hover:bg-olive/10"
              size="sm"
            >
              Ou louer ce modèle →
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};