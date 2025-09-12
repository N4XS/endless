import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ProductInfoCardProps {
  product: {
    name: string;
    price: number;
  };
  onAddToCart: () => void;
}

export const ProductInfoCard = ({ product, onAddToCart }: ProductInfoCardProps) => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">{product.name}</h2>
          <p className="text-sm text-muted-foreground">TTC, frais de port non compris</p>
        </div>
        
        <div className="text-4xl font-bold text-primary">{product.price}€</div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-muted-foreground">En stock</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Livraison sous 24-48 heures ouvrables</span>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Garantie :</span>
            <span className="text-right">Satisfait ou remboursé 30 jours</span>
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
        
        <Button 
          className="w-full" 
          onClick={onAddToCart}
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};