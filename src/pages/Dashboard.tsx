import { CustomerLayout } from '@/components/CustomerLayout';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Clock, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const getStatusBadge = (status: string) => {
  const statusMap = {
    pending: { label: 'En attente', variant: 'secondary' as const },
    confirmed: { label: 'Confirmée', variant: 'default' as const },
    shipped: { label: 'Expédiée', variant: 'outline' as const },
    delivered: { label: 'Livrée', variant: 'default' as const }
  };
  
  return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.amount_cents, 0) / 100;
  const recentOrders = orders.slice(0, 3);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Espace Client</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos commandes et consultez vos achats
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders > 0 && `${pendingOrders} en attente`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Montant total</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">
                Depuis votre inscription
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernière commande</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentOrders[0] ? new Date(recentOrders[0].created_at).toLocaleDateString('fr-FR') : 'Aucune'}
              </div>
              <p className="text-xs text-muted-foreground">
                {recentOrders[0] && `${(recentOrders[0].amount_cents / 100).toFixed(2)} €`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Vos dernières commandes</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/mon-compte/commandes">
                  <Package className="mr-2 h-4 w-4" />
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-sm font-medium text-foreground">Aucune commande</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vous n'avez pas encore passé de commande.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/tentes">Découvrir nos tentes</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">
                            Commande #{order.id.slice(0, 8)}
                          </p>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                          <span className="mx-2">•</span>
                          <span>{(order.amount_cents / 100).toFixed(2)} €</span>
                          <span className="mx-2">•</span>
                          <span>{order.order_items.length} article{order.order_items.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}