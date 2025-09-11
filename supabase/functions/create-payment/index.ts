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
  
  const allowedOrigin = allowedOrigins.includes(origin || "") ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
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
  return !origin || allowedOrigins.includes(origin);
};

// Helpers
const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

const computeShippingCostCents = (country?: string) => {
  const code = (country || "").toUpperCase();
  if (code === "BE") return 0; // Livraison gratuite en Belgique
  return 1500; // Par défaut 15€ ailleurs (ajustable)
};

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

    const { items, shipping_country, customer_email } = await req.json();
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

    // Charger les produits depuis la DB et construire les lignes Stripe
    const ids: string[] = items.map((i: any) => String(i.product_id ?? i.id ?? ""));
    const slugs: string[] = items.map((i: any) => String(i.slug ?? ""));

    // Récupérer par id OU par slug
    let productsRes = await supabaseService
      .from("products")
      .select("id,name,slug,price_cents,currency,stock,active")
      .in("id", ids.filter((x) => isUUID(x)));

    if (productsRes.error) throw productsRes.error;
    let products = productsRes.data ?? [];

    if (products.length < items.length) {
      // Compléter via slug si nécessaire
      const missingBySlug = slugs.filter(Boolean);
      if (missingBySlug.length) {
        const bySlug = await supabaseService
          .from("products")
          .select("id,name,slug,price_cents,currency,stock,active")
          .in("slug", missingBySlug);
        if (bySlug.error) throw bySlug.error;
        const merged = new Map<string, any>();
        for (const p of products) merged.set(p.id, p);
        for (const p of bySlug.data ?? []) merged.set(p.id, p);
        products = Array.from(merged.values());
      }
    }

    // Mapper produits et valider quantités/stock
    const productMap = new Map<string, any>();
    for (const p of products) productMap.set(p.id, p);

    type ItemReq = { product_id?: string; id?: string; slug?: string; quantity: number };
    const normalizedItems = items.map((i: ItemReq) => {
      const pid = isUUID(String(i.product_id ?? i.id ?? ""))
        ? String(i.product_id ?? i.id)
        : undefined;
      const bySlug = !pid ? (products.find((p) => p.slug === i.slug)?.id) : undefined;
      const finalId = pid ?? bySlug;
      if (!finalId) throw new Error("Produit introuvable");
      const qty = Math.max(1, Number(i.quantity || 1));
      return { product_id: finalId, quantity: qty };
    });

    let subtotalCents = 0;
    for (const it of normalizedItems) {
      const p = productMap.get(it.product_id);
      if (!p || !p.active) throw new Error("Produit inactif ou introuvable");
      if (typeof p.stock === "number" && p.stock < it.quantity) throw new Error(`Stock insuffisant pour ${p.name}`);
      subtotalCents += p.price_cents * it.quantity;
    }

    const shippingCents = computeShippingCostCents(shipping_country);
    const totalCents = subtotalCents + shippingCents;

    // Stripe setup
    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
    const origin = req.headers.get("origin") || "http://localhost:5173";

    const effectiveEmail = email || customer_email || "guest@example.com";
    const customers = await stripe.customers.list({ email: effectiveEmail, limit: 1 });
    const customerId = customers.data[0]?.id;

    const line_items = normalizedItems.map((it) => {
      const p = productMap.get(it.product_id);
      return {
        price_data: {
          currency: "eur",
          product_data: { name: p.name },
          unit_amount: p.price_cents,
        },
        quantity: it.quantity,
      } as any;
    });

    // Optionnel: ajouter les frais de port en tant que ligne séparée si > 0
    if (shippingCents > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: shippingCents,
        },
        quantity: 1,
      } as any);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : effectiveEmail,
      line_items,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
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