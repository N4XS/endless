import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, Mail, Euro } from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { label: 'En attente', variant: 'secondary' as const },
    confirmed: { label: 'Confirmée', variant: 'default' as const },
    shipped: { label: 'Expédiée', variant: 'outline' as const },
    delivered: { label: 'Livrée', variant: 'default' as const }
  };
  
  return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
};

export const OrderDetails = ({ order, open, onOpenChange }: OrderDetailsProps) => {
  const { products } = useProducts();

  if (!order) return null;

  const statusInfo = getStatusBadge(order.status);
  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

  const getProductInfo = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Commande #{order.id.slice(0, 8)}</span>
          </DialogTitle>
          <DialogDescription>
            Détails de votre commande du {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and basic info */}
          <div className="flex items-center justify-between">
            <Badge variant={statusInfo.variant} className="text-sm">
              {statusInfo.label}
            </Badge>
            <div className="text-right text-sm text-muted-foreground">
              Créée le {new Date(order.created_at).toLocaleDateString('fr-FR')} à {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Informations client
            </h3>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p>{order.customer_email}</p>
            </div>
          </div>

          <Separator />

          {/* Order items */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Articles commandés ({totalItems} article{totalItems > 1 ? 's' : ''})
            </h3>
            
            <div className="space-y-3">
              {order.order_items.map((item) => {
                const product = getProductInfo(item.product_id);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {product?.name || `Produit ${item.product_id.slice(0, 8)}`}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        Quantité: {item.quantity} • Prix unitaire: {(item.unit_price_cents / 100).toFixed(2)} €
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{(item.total_cents / 100).toFixed(2)} €</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Order summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{(order.amount_cents / 100).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span className="flex items-center">
                <Euro className="mr-1 h-4 w-4" />
                {(order.amount_cents / 100).toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p><strong>ID de commande:</strong> {order.id}</p>
            <p><strong>Devise:</strong> {order.currency.toUpperCase()}</p>
            {order.updated_at !== order.created_at && (
              <p><strong>Dernière mise à jour:</strong> {new Date(order.updated_at).toLocaleDateString('fr-FR')} à {new Date(order.updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};