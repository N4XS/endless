-- Create products table for tents and accessories
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('tent', 'accessory')),
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for purchase tracking
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled', 'failed')),
  shipping_country TEXT,
  shipping_cost_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table for individual items in orders
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, service role only for mutations)
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage products" ON public.products
FOR ALL USING (true);

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (user_id = auth.uid() OR (user_id IS NULL AND customer_email = auth.email()));

CREATE POLICY "Service role can manage orders" ON public.orders
FOR ALL USING (true);

-- Order items policies (users can only see items from their orders)
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR (orders.user_id IS NULL AND orders.customer_email = auth.email()))
  )
);

CREATE POLICY "Service role can manage order items" ON public.order_items
FOR ALL USING (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert tent products from existing data
INSERT INTO public.products (name, slug, sku, category, price_cents, stock, images, specs, description, features) VALUES
('STARZZ', 'starzz', 'TENT-STARZZ-001', 'tent', 189900, 5, 
 ARRAY['/src/assets/product-hardshell-tent.jpg'], 
 '{"sleeping": 2, "shell": "hard", "weightKg": 45, "closedSize": "120 x 100 x 30 cm", "openSize": "210 x 120 x 95 cm", "materials": ["Aluminium", "Toile ripstop 600D"], "compatibility": "Barres de toit universelles"}',
 'Tente de toit rigide ultra-premium avec ouverture rapide et isolation supérieure. Parfaite pour les aventures en toute saison.',
 ARRAY['Ouverture en 60 secondes', 'Isolation thermique renforcée', 'Matelas haute densité inclus', 'Résistant aux intempéries', 'Compatible barres de toit universelles']
);

-- Add indexes for better performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);