import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Server-side validated preorder creation endpoint

interface PreorderRequest {
  product_id: string;
  customer_email: string;
  customer_name: string;
  quantity: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validatePreorderInput(body: unknown): { valid: true; data: PreorderRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { product_id, customer_email, customer_name, quantity } = body as Record<string, unknown>;

  // Validate product_id (UUID format)
  if (!product_id || typeof product_id !== 'string' || !UUID_REGEX.test(product_id)) {
    return { valid: false, error: 'Invalid product_id format' };
  }

  // Validate email
  if (!customer_email || typeof customer_email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = customer_email.trim().toLowerCase();
  if (trimmedEmail.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate name
  if (!customer_name || typeof customer_name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }
  
  const trimmedName = customer_name.trim();
  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (trimmedName.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  // Basic sanitization - remove potentially dangerous characters
  const sanitizedName = trimmedName.replace(/[<>]/g, '');

  // Validate quantity
  const parsedQuantity = typeof quantity === 'number' ? quantity : parseInt(String(quantity), 10);
  if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 10) {
    return { valid: false, error: 'Quantity must be between 1 and 10' };
  }

  return {
    valid: true,
    data: {
      product_id,
      customer_email: trimmedEmail,
      customer_name: sanitizedName,
      quantity: parsedQuantity
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check content length (max 5KB)
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > 5120) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase with service role
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE, {
      auth: { persistSession: false }
    });

    // Parse and validate request body
    const body = await req.json();
    const validation = validatePreorderInput(body);
    
    if (!validation.valid) {
      console.log('[create-preorder] Validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { product_id, customer_email, customer_name, quantity } = validation.data;

    // Verify product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, active')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      console.log('[create-preorder] Product not found:', product_id);
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!product.active) {
      return new Response(
        JSON.stringify({ error: 'Product is not available for preorder' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert preorder
    const { data: preorder, error: insertError } = await supabase
      .from('preorders')
      .insert({
        product_id,
        customer_email,
        customer_name,
        quantity,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('[create-preorder] Database error:', insertError);
      throw insertError;
    }

    console.log('[create-preorder] Preorder created:', preorder.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        preorder_id: preorder.id,
        message: 'Preorder created successfully' 
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[create-preorder] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
