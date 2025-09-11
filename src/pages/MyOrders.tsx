import { useState } from 'react';
import { CustomerLayout } from '@/components/CustomerLayout';
import { useOrders, Order } from '@/hooks/useOrders';
import { OrderCard } from '@/components/OrderCard';
import { OrderDetails } from '@/components/OrderDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Package, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const { orders, loading, error, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erreur: {error}</p>
              <Button onClick={refetch} variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Commandes</h1>
          <p className="text-muted-foreground mt-2">
            Retrouvez l'historique de toutes vos commandes
          </p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtres et recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro de commande ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="shipped">Expédiées</SelectItem>
                  <SelectItem value="delivered">Livrées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {orders.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {orders.length === 0 
                    ? 'Vous n\'avez pas encore passé de commande.'
                    : 'Aucune commande ne correspond à vos critères de recherche.'
                  }
                </p>
                {orders.length === 0 && (
                  <Button asChild className="mt-4">
                    <Link to="/tentes">Découvrir nos tentes</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
              </p>
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}

        {/* Order Details Modal */}
        <OrderDetails
          order={selectedOrder}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </div>
    </CustomerLayout>
  );
}