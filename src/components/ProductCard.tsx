import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Shield, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { LazyImage } from './LazyImage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PreorderDialog } from './PreorderDialog';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

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
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`
    });
  };

  const CardWrapper = prefersReducedMotion ? 'div' : motion.div;
  const cardProps = prefersReducedMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const specs = [
    { icon: Users, label: 'Capacité', value: '2-3 pers.' },
    { icon: Shield, label: 'Résistance', value: '350 kg' },
    { icon: Clock, label: 'Installation', value: '60 sec' },
  ];

  return (
    <CardWrapper className={cn("w-full", className)} {...cardProps}>
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-border/80 transition-all duration-300 hover:shadow-lg">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden group">
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Stock badge */}
            {product.stock === 0 && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-foreground/90 text-background text-xs font-medium rounded-full">
                  Rupture de stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <Link to="/tentes" className="group/link">
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 group-hover/link:text-primary transition-colors">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3">
                {specs.map((spec, index) => (
                  <div key={index} className="text-center p-3 rounded-md bg-muted/50">
                    <spec.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                    <div className="text-sm font-medium text-foreground">{spec.value}</div>
                    <div className="text-xs text-muted-foreground">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-semibold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">TTC</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Installation comprise</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <Link to="/tentes" className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group">
                    Voir les détails
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                {product.stock > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    className="px-4"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                ) : (
                  <PreorderDialog product={product}>
                    <Button variant="outline" className="px-4">
                      <Clock className="w-5 h-5" />
                    </Button>
                  </PreorderDialog>
                )}
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 text-sm">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  product.stock > 0 ? "bg-green-500" : "bg-orange-500"
                )} />
                <span className="text-muted-foreground">
                  {product.stock > 0 
                    ? "En stock • Livraison 24-48h" 
                    : "Précommande disponible"
                  }
                </span>
              </div>

              {/* Rental link */}
              {product.category === 'tent' && (
                <Link 
                  to="/location" 
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ou essayez en location d'abord →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
