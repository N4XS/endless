import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';
import { PreorderDialog } from './PreorderDialog';

interface ProductInfoCardProps {
  product: Product;
  onAddToCart: () => void;
}

export const ProductInfoCard = ({ product, onAddToCart }: ProductInfoCardProps) => {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">{product.name}</h2>
          <p className="text-sm text-muted-foreground">TTC, frais de port non compris</p>
        </div>
        
        <div className="text-4xl font-bold text-primary">{product.price}€</div>
        
        <div className="flex items-center gap-2 text-sm">
          {product.stock > 0 ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-muted-foreground">En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-destructive"></div>
              <span className="text-destructive font-medium">Rupture de stock</span>
              <Badge variant="secondary" className="ml-2">
                Précommande disponible
              </Badge>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {product.stock > 0 ? (
            <>
              <Clock className="w-4 h-4" />
              <span>Livraison 24-48h (Belgique uniquement)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Livraison estimée : 3-4 semaines</span>
            </>
          )}
        </div>
        
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Garantie :</span>
            <span className="text-right">Garantie constructeur 1 an</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expédition :</span>
            <span>24-48 heures ouvrables</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Conditions :</span>
            <Link to="/cgv" className="text-primary hover:underline">CGV</Link>
          </div>
        </div>
        
        {product.stock > 0 ? (
          <Button 
            className="w-full" 
            onClick={onAddToCart}
          >
            Ajouter au panier
          </Button>
        ) : (
          <PreorderDialog product={product}>
            <Button className="w-full" variant="secondary">
              Précommander maintenant
            </Button>
          </PreorderDialog>
        )}
      </div>
    </div>
  );
};