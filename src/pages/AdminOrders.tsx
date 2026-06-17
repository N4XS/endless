import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Mail, Package, Euro } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  products: { name: string } | null;
}

interface AdminOrder {
  id: string;
  created_at: string;
  status: string;
  customer_email: string;
  amount_cents: number;
  shipping_country: string | null;
  shipping_name: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_state: string | null;
  shipping_phone: string | null;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  paid:      { label: 'Payée',      variant: 'default' },
  pending:   { label: 'En attente', variant: 'secondary' },
  canceled:  { label: 'Annulée',    variant: 'destructive' },
  failed:    { label: 'Échouée',    variant: 'destructive' },
};

const formatEur = (cents: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(cents / 100);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Veuillez vous connecter'); navigate('/auth'); return; }

      const { data: isAdmin, error } = await supabase.rpc('is_admin');
      if (error || !isAdmin) { toast.error('Accès non autorisé'); navigate('/'); return; }

      setIsAuthorized(true);
      fetchOrders();
    } catch {
      toast.error('Erreur de vérification des droits');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => { checkAdminAccess(); }, [checkAdminAccess]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*, products(name))`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as AdminOrder[]) || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const paid    = orders.filter(o => o.status === 'paid').length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const revenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.amount_cents, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Commandes</h1>
        <p className="text-muted-foreground mb-8">Récapitulatif de toutes les commandes avec adresses de livraison</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Euro className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Revenus (payées)</p>
                <p className="text-2xl font-bold">{formatEur(revenue)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Package className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Commandes payées</p>
                <p className="text-2xl font-bold">{paid}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Package className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{pending}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Aucune commande pour le moment.</CardContent></Card>
          )}
          {orders.map(order => {
            const status = statusConfig[order.status] ?? { label: order.status, variant: 'secondary' as const };
            const hasAddress = order.shipping_address_line1 || order.shipping_city;
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-mono">#{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">{formatEur(order.amount_cents)}</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {/* Client + articles */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{order.customer_email}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Articles :</p>
                      {order.order_items.map(item => (
                        <div key={item.id} className="text-sm text-muted-foreground flex justify-between">
                          <span>{item.products?.name ?? 'Produit'} × {item.quantity}</span>
                          <span>{formatEur(item.total_cents)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-sm font-medium">Adresse de livraison</p>
                    </div>
                    {hasAddress ? (
                      <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                        {order.shipping_name && <p className="font-medium text-foreground">{order.shipping_name}</p>}
                        {order.shipping_address_line1 && <p>{order.shipping_address_line1}</p>}
                        {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                        {(order.shipping_postal_code || order.shipping_city) && (
                          <p>{[order.shipping_postal_code, order.shipping_city].filter(Boolean).join(' ')}</p>
                        )}
                        {order.shipping_state && <p>{order.shipping_state}</p>}
                        {order.shipping_country && <p className="uppercase font-medium">{order.shipping_country}</p>}
                        {order.shipping_phone && <p className="mt-1">📞 {order.shipping_phone}</p>}
                      </address>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {order.status === 'pending'
                          ? 'En attente de confirmation du paiement'
                          : 'Adresse non disponible'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
