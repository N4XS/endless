import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      // Transform Supabase data to Product interface
      const transformedProducts: Product[] = data.map(item => {
        // Safely parse specs from JSONB
        let specs;
        try {
          specs = (item.specs as any) || {
            sleeping: 0,
            shell: "hard" as const,
            weightKg: 0,
            closedSize: "",
            openSize: ""
          };
        } catch {
          specs = {
            sleeping: 0,
            shell: "hard" as const,
            weightKg: 0,
            closedSize: "",
            openSize: ""
          };
        }

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price_cents / 100, // Convert cents to euros
          currency: item.currency as "EUR",
          category: item.category as "tent" | "accessory",
          badges: [], // You can add badges logic here
          specs,
          images: item.images || [],
          stock: item.stock > 0 ? "in_stock" : "out_of_stock",
          sku: item.sku,
          description: item.description,
          features: item.features || []
        };
      });

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
};