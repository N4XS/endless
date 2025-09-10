import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("Stripe secret key missing. Configure STRIPE_SECRET_KEY in Supabase secrets.");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth: { persistSession: false } });

    let payload: any = {};
    try {
      payload = await req.json();
    } catch (_) {
      // ignore
    }

    const url = new URL(req.url);
    const qpSession = url.searchParams.get("session_id");
    const bodySession = payload?.session_id;
    const sessionId = qpSession || bodySession;
    if (!sessionId) throw new Error("'session_id' est requis");

    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Récupérer la commande liée à cette session
    const { data: order, error: orderErr } = await supabaseService
      .from("orders")
      .select("id, status")
      .eq("stripe_session_id", session.id)
      .maybeSingle();
    if (orderErr) throw orderErr;
    if (!order) throw new Error("Commande introuvable pour cette session");

    let newStatus: "paid" | "canceled" | "failed" = "failed";
    if (session.payment_status === "paid") newStatus = "paid";
    else if (session.status === "canceled") newStatus = "canceled";

    // Mettre à jour le statut
    const { error: updErr } = await supabaseService
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    if (updErr) throw updErr;

    // Si payé, décrémenter le stock
    if (newStatus === "paid") {
      const { data: items, error: itErr } = await supabaseService
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order.id);
      if (itErr) throw itErr;

      const productIds = items.map((i) => i.product_id);
      const { data: prods, error: pErr } = await supabaseService
        .from("products")
        .select("id, stock")
        .in("id", productIds);
      if (pErr) throw pErr;
      const pMap = new Map<string, number>();
      for (const p of prods) pMap.set(p.id, p.stock ?? 0);

      for (const it of items) {
        const current = pMap.get(it.product_id) ?? 0;
        const next = Math.max(0, current - it.quantity);
        const { error: uErr } = await supabaseService
          .from("products")
          .update({ stock: next })
          .eq("id", it.product_id);
        if (uErr) throw uErr;
      }
    }

    return new Response(JSON.stringify({ order_id: order.id, status: newStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("[verify-payment] Error:", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});