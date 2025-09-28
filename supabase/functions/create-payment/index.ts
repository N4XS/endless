import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Generate dynamic CORS headers based on request origin
const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://gbkpdgchdkkydpzycfkr.lovable.app",
    "https://endless-tents.com",
    "http://localhost:5173", // For development
  ];
  
  // Allow any lovableproject.com subdomain
  const isLovableProject = origin && origin.match(/^https:\/\/[a-f0-9\-]+\.lovableproject\.com$/);
  
  const allowedOrigin = allowedOrigins.includes(origin || "") || isLovableProject ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin || allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

// Generate secure random token for guest orders
const generateGuestToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate request origin for additional security
const validateOrigin = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://gbkpdgchdkkydpzycfkr.lovable.app",
    "https://endless-tents.com",
    "http://localhost:5173", // For development
  ];
  
  // Allow any lovableproject.com subdomain
  const isLovableProject = origin && origin.match(/^https:\/\/[a-f0-9\-]+\.lovableproject\.com$/);
  
  return !origin || allowedOrigins.includes(origin) || !!isLovableProject;
};

// Helpers
const isUUID = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

const computeShippingCostCents = (country?: string) => {
  const code = (country || "").toUpperCase();
  if (code === "BE") return 0; // Livraison gratuite en Belgique
  return 1500; // Par défaut 15€ ailleurs (ajustable)
};

// Fetch product by reference (UUID or slug)
async function fetchProductByRef(ref: string, supabaseAdmin: any) {
  const column = isUUID(ref) ? 'id' : 'slug';
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, slug, name, price_cents, currency, stock, active')
    .eq(column, ref)
    .maybeSingle();

  if (error) throw error;
  return data;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Validate request origin for additional security
    if (!validateOrigin(req)) {
      console.warn("[create-payment] Unauthorized origin:", req.headers.get("origin"));
      return new Response(JSON.stringify({ error: "Unauthorized origin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    console.log("[create-payment] Function started");
    
    // Check all required environment variables
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const missingVars = [];
    if (!stripeSecret) missingVars.push("STRIPE_SECRET_KEY");
    if (!SUPABASE_URL) missingVars.push("SUPABASE_URL");
    if (!SUPABASE_ANON) missingVars.push("SUPABASE_ANON_KEY");
    if (!SUPABASE_SERVICE) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

    if (missingVars.length > 0) {
      const errorMsg = `Missing required environment variables: ${missingVars.join(", ")}`;
      console.error("[create-payment] ERROR:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("[create-payment] Environment variables validated");

    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON);
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth: { persistSession: false } });

    const { items, shipping_country, customer_email, discount_code_id } = await req.json();
    if (!Array.isArray(items) || items.length === 0) throw new Error("'items' est requis et ne peut pas être vide");

    // Auth (facultative) pour associer l'utilisateur si connecté
    let userId: string | null = null;
    let email: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseAnon.auth.getUser(token);
      if (userData?.user) {
        userId = userData.user.id;
        email = userData.user.email ?? null;
      }
    }

    // Validate and process items
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun article' }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      });
    }

    const lineItems: Array<{ price_data: any; quantity: number }> = [];
    const normalizedItems: Array<{ product_id: string; quantity: number }> = [];
    const productMap = new Map<string, any>();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it || typeof it.product_id !== 'string' || !it.product_id.trim()) {
        return new Response(JSON.stringify({ error: `Item ${i}: product_id manquant` }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        });
      }
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        return new Response(JSON.stringify({ error: `Item ${i}: quantity invalide` }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        });
      }

      const product = await fetchProductByRef(it.product_id, supabaseService);
      if (!product) {
        console.error('[create-payment] Product not found for item', i, it);
        return new Response(JSON.stringify({ error: 'Produit introuvable' }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        });
      }

      // Store product in map for later use
      productMap.set(product.id, product);

      // Validate product is active and check stock
      if (!product.active) {
        return new Response(JSON.stringify({ error: 'Produit inactif' }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        });
      }

      // Allow preorders when stock is 0, but check stock if > 0
      if (typeof product.stock === "number" && product.stock > 0 && product.stock < it.quantity) {
        return new Response(JSON.stringify({ error: `Stock insuffisant pour ${product.name}. Stock disponible: ${product.stock}` }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        });
      }

      normalizedItems.push({ product_id: product.id, quantity: it.quantity });
      
      // Create detailed order summary for the product description
      const orderSummary = `📦 Récapitulatif de votre commande:
• Produit: ${product.name}
• Prix: ${(product.price_cents / 100).toFixed(2)}€ TTC
• Quantité: ${it.quantity}
• Installation comprise
• Garantie constructeur 2 ans
• Livraison: ${shipping_country || 'Belgique'}`;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { 
            name: `${product.name} - Tente de Toit`,
            description: orderSummary
          },
          unit_amount: product.price_cents,
        },
        quantity: it.quantity,
      });
    }

    // Calculate subtotal
    let subtotalCents = 0;
    for (const it of normalizedItems) {
      const product = productMap.get(it.product_id);
      subtotalCents += product.price_cents * it.quantity;
    }

    const shippingCents = computeShippingCostCents(shipping_country);
    
    // Apply discount code if provided
    let discountAmountCents = 0;
    let discountId: string | null = null;
    
    if (discount_code_id) {
      const { data: discountData, error: discountError } = await supabaseService.rpc('validate_discount_code_by_id', {
        discount_id: discount_code_id,
        order_amount_cents: subtotalCents + shippingCents
      });
      
      if (discountError) {
        console.error("[create-payment] Discount validation error:", discountError);
        throw new Error("Erreur lors de la validation du code de réduction");
      }
      
      const discountResult = discountData?.[0];
      if (discountResult?.valid) {
        discountAmountCents = discountResult.discount_amount_cents;
        discountId = discount_code_id;
      } else {
        throw new Error(discountResult?.message || "Code de réduction invalide");
      }
    }
    
    const totalCents = subtotalCents + shippingCents - discountAmountCents;

    // Stripe setup
    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
    const origin = req.headers.get("origin") || "http://localhost:5173";

    const effectiveEmail = email || customer_email || "guest@example.com";
    const customers = await stripe.customers.list({ email: effectiveEmail, limit: 1 });
    const customerId = customers.data[0]?.id;

    // Add shipping costs as separate line item if > 0
    if (shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : effectiveEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES', 'PT', 'NL'],
      },
      billing_address_collection: 'required',
      custom_text: {
        submit: {
          message: "🚚 Livraison en 24–48h en Belgique | ✅ Installation comprise | 🛡️ Garantie 2 ans"
        }
      }
    });

    console.log("[create-payment] Stripe session created successfully:", {
      sessionId: session.id,
      url: session.url,
      mode: session.mode,
      status: session.status
    });

    // Generate guest token for order retrieval security
    const guestToken = generateGuestToken();

    // Créer la commande en attente et ses items
    const { data: order, error: orderErr } = await supabaseService
      .from("orders")
      .insert({
        user_id: userId,
        customer_email: effectiveEmail,
        stripe_session_id: session.id,
        amount_cents: totalCents,
        currency: "eur",
        status: "pending",
        shipping_country: shipping_country ?? null,
        shipping_cost_cents: shippingCents,
        guest_access_token: guestToken,
        discount_code_id: discountId,
        discount_amount_cents: discountAmountCents,
      })
      .select("id, guest_access_token")
      .single();
    if (orderErr) throw orderErr;

    const orderItems = normalizedItems.map((it) => {
      const p = productMap.get(it.product_id);
      const unit = p.price_cents;
      return {
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price_cents: unit,
        total_cents: unit * it.quantity,
      };
    });

    const { error: oiErr } = await supabaseService.from("order_items").insert(orderItems);
    if (oiErr) throw oiErr;

    // Increment discount usage if discount was applied
    if (discountId) {
      const { error: incrementErr } = await supabaseService.rpc('increment_discount_usage', {
        discount_id: discountId
      });
      if (incrementErr) {
        console.error("[create-payment] Error incrementing discount usage:", incrementErr);
        // Don't throw error as the order is already created
      }
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      guest_token: order.guest_access_token
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("[create-payment] Error:", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});