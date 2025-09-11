import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { securityMonitor } from '@/utils/security';

export interface Order {
  id: string;
  status: string;
  amount_cents: number;
  currency: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
    product_id: string;
  }[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Log security event for order access
      securityMonitor.logEvent({
        type: 'data_access',
        details: 'User accessing order history',
        userId: user.id,
        metadata: { action: 'fetch_orders', timestamp: new Date().toISOString() }
      });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'paid')  // Only show paid orders
        .order('created_at', { ascending: false });

      if (error) {
        securityMonitor.logEvent({
          type: 'security_alert',
          details: 'Failed to fetch orders',
          userId: user.id,
          metadata: { error: error.message, timestamp: new Date().toISOString() }
        });
        throw error;
      }
      
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return { orders, loading, error, refetch: fetchOrders };
};