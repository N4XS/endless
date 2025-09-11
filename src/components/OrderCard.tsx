import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, Euro, Eye } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
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

export const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const statusInfo = getStatusBadge(order.status);
  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">#{order.id.slice(0, 8)}</span>
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{(order.amount_cents / 100).toFixed(2)} €</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {totalItems} article{totalItems > 1 ? 's' : ''} • {order.order_items.length} produit{order.order_items.length > 1 ? 's' : ''}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(order)}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
};