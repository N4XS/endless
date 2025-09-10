import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Users, Weight } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`
    });
  };

  const getShellIcon = (shell: 'hard' | 'soft') => {
    return shell === 'hard' ? '🛡️' : '🏕️';
  };

  return (
    <div className={cn("w-full max-w-none group", className)}>
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hero transition-all duration-300 border border-border">
        <div className="grid md:grid-cols-12 gap-0 min-h-[400px]">
          {/* Image Section */}
          <div className="relative md:col-span-5 aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            

            {/* Actions rapides */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-3 bg-background/95 backdrop-blur rounded-full shadow-soft hover:bg-background hover:shadow-hero transition-all">
                <Heart className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between min-h-[400px]">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <Link
                  to={`/tentes`}
                  className="block group-hover:text-primary transition-colors"
                >
                  <h2 className="font-display font-bold text-3xl lg:text-4xl mb-2 text-foreground">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-sunset flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">2-3 personnes</div>
                    <div className="text-sm text-muted-foreground">Capacité</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-sunset flex items-center justify-center">
                    <Weight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{product.specs.weightKg}kg</div>
                    <div className="text-sm text-muted-foreground">Poids</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 col-span-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-sunset flex items-center justify-center">
                    <span className="text-xl">{getShellIcon(product.specs.shell)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground capitalize">Ouverture en 60 secondes</div>
                    <div className="text-sm text-muted-foreground">Installation rapide</div>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="bg-gradient-nature rounded-lg p-6">
                <div className="flex items-center justify-between">
                   <div>
                     <div className="text-4xl font-bold text-primary">
                       {formatPrice(product.price)}
                     </div>
                     <div className="text-sm text-muted-foreground">TTC, installation comprise</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-3">
                <Link to="/tentes" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Voir les détails
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleAddToCart}
                  className="px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  disabled={product.stock === 'out_of_stock'}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>

              {/* Lien location */}
              {product.category === 'tent' && (
                <Link to="/location" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-olive hover:text-olive hover:bg-olive/10 font-medium"
                    size="lg"
                  >
                    Ou essayer en location d'abord →
                  </Button>
                </Link>
              )}

              {/* Stock indicator */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">En stock • Livraison sous 3-5 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};