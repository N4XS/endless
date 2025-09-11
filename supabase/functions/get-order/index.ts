import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Generate dynamic CORS headers based on request origin
const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://gbkpdgchdkkydpzycfkr.lovable.app",
    "https://endless-tents.com",
    "http://localhost:5173", // For development
  ];
  
  const allowedOrigin = allowedOrigins.includes(origin || "") ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

// Input validation for guest token
function validateGuestToken(token: any): { valid: boolean; error?: string } {
  if (!token) {
    return { valid: false, error: 'Guest access token is required' };
  }
  
  if (typeof token !== 'string') {
    return { valid: false, error: 'Guest access token must be a string' };
  }
  
  // Basic token format validation (64 hex characters)
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return { valid: false, error: 'Invalid guest access token format' };
  }
  
  return { valid: true };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth: { persistSession: false } });

    // Parse token from URL params or JSON body
    let token: string | null = null;
    
    // Try URL params first
    const url = new URL(req.url);
    token = url.searchParams.get("token");
    
    // If not in URL, try JSON body
    if (!token && req.method === "POST") {
      try {
        const body = await req.json();
        token = body.token;
      } catch (e) {
        console.log("[get-order] Could not parse JSON body, using URL token only");
      }
    }
    
    console.log(`[get-order] Received token: ${token ? "present" : "missing"}`);
    
    // Validate guest token
    const validation = validateGuestToken(token);
    if (!validation.valid) {
      console.error('[get-order] Token validation failed:', validation.error);
      return new Response(JSON.stringify({ error: validation.error }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get secure order details using our protected function
    // First find the order ID using the token, then get details
    const { data: orderLookup, error: lookupErr } = await supabaseService
      .from("orders")
      .select("id")
      .eq("guest_access_token", token)
      .eq("user_id", null)
      .maybeSingle();

    if (lookupErr) {
      console.error('[get-order] Order lookup error:', lookupErr);
      throw new Error("Erreur lors de la recherche de commande");
    }

    if (!orderLookup) {
      console.log('[get-order] No order found for token');
      await supabaseService.rpc('log_guest_order_access', {
        order_id: 'unknown',
        success: false
      });
      throw new Error("Commande introuvable ou token invalide");
    }

    // Now get secure order details using our protected function
    const { data: orderDetails, error: orderErr } = await supabaseService
      .rpc('get_guest_order_details', {
        order_id: orderLookup.id,
        token: token
      });

    if (orderErr) {
      console.error('[get-order] Error fetching order details:', orderErr);
      await supabaseService.rpc('log_guest_order_access', {
        order_id: orderLookup.id,
        success: false
      });
      throw orderErr;
    }

    if (!orderDetails || orderDetails.length === 0) {
      await supabaseService.rpc('log_guest_order_access', {
        order_id: orderLookup.id,
        success: false
      });
      throw new Error("Commande introuvable");
    }

    const order = orderDetails[0];
    
    // Get order items separately (these don't contain sensitive data)
    const { data: orderItems, error: itemsErr } = await supabaseService
      .from("order_items")
      .select(`
        quantity,
        unit_price_cents,
        total_cents,
        products (
          name,
          slug
        )
      `)
      .eq("order_id", order.id);

    if (itemsErr) {
      console.error('[get-order] Error fetching order items:', itemsErr);
    }

    console.log(`[get-order] Order retrieved successfully: ${order.id}`);
    
    // Log successful access
    await supabaseService.rpc('log_guest_order_access', {
      order_id: order.id,
      success: true
    });

    // Return order data (all sensitive fields already excluded by secure function)
    return new Response(JSON.stringify({
      order_id: order.id,
      status: order.status,
      amount_cents: order.amount_cents,
      currency: order.currency,
      shipping_country: order.shipping_country,
      shipping_cost_cents: order.shipping_cost_cents,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: orderItems || []
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("[get-order] Error:", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});