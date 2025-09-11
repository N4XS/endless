import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Secure CORS headers - restrict to specific domain
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://gbkpdgchdkkydpzycfkr.lovable.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
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

    // Retrieve order using the secure guest token
    const { data: order, error: orderErr } = await supabaseService
      .from("orders")
      .select(`
        id,
        status,
        amount_cents,
        currency,
        shipping_country,
        shipping_cost_cents,
        created_at,
        customer_email,
        order_items (
          quantity,
          unit_price_cents,
          total_cents,
          products (
            name,
            slug
          )
        )
      `)
      .eq("guest_access_token", token)
      .maybeSingle();

    if (orderErr) throw orderErr;
    if (!order) throw new Error("Commande introuvable ou token invalide");

    console.log(`[get-order] Order retrieved successfully: ${order.id}`);

    return new Response(JSON.stringify({
      order_id: order.id,
      status: order.status,
      amount_cents: order.amount_cents,
      currency: order.currency,
      shipping_country: order.shipping_country,
      shipping_cost_cents: order.shipping_cost_cents,
      created_at: order.created_at,
      customer_email: order.customer_email,
      items: order.order_items
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