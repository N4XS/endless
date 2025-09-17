-- Create preorders table
CREATE TABLE public.preorders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'fulfilled')),
  estimated_delivery TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers can view their own preorders"
ON public.preorders
FOR SELECT
USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can manage preorders"
ON public.preorders
FOR ALL
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_preorders_updated_at
BEFORE UPDATE ON public.preorders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();