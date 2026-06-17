import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Generate dynamic CORS headers based on request origin
const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://endless-tents.com",
    "http://localhost:5173", // For development
  ];
  
  // Allow any lovableproject.com subdomain
  const isLovableProject = origin && origin.match(/^https:\/\/[a-f0-9-]+.lovableproject.com$/);
  
  const allowedOrigin = allowedOrigins.includes(origin || "") || isLovableProject ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin || allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
};

// Validate request origin for additional security
const validateOrigin = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://endless-tents.com",
    "http://localhost:5173", // For development
  ];
  
  // Allow any lovableproject.com subdomain
  const isLovableProject = origin && origin.match(/^https:\/\/[a-f0-9-]+.lovableproject.com$/);
  
  return !origin || allowedOrigins.includes(origin) || !!isLovableProject;
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Validate request origin for additional security
    if (!validateOrigin(req)) {
      console.warn("[verify-payment] Unauthorized origin:", req.headers.get("origin"));
      return new Response(JSON.stringify({ error: "Unauthorized origin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("Stripe secret key missing. Configure STRIPE_SECRET_KEY in Supabase secrets.");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth: { persistSession: false } });

    let payload: Record<string, unknown> = {};
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
    // Be stricter: require both a completed session AND a paid payment status
    if (session.status === "complete" && session.payment_status === "paid") newStatus = "paid";
    else if (session.status === "expired") newStatus = "canceled";
    else if (session.status === "open") newStatus = "failed";

    // Update status only if it actually changed to avoid unnecessary writes
    if (order.status !== newStatus) {
      // Extract shipping details from Stripe session for paid orders
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === "paid" && session.shipping_details?.address) {
        const shippingDetails = session.shipping_details;
        updateData.shipping_name = shippingDetails.name;
        updateData.shipping_address_line1 = shippingDetails.address.line1;
        updateData.shipping_address_line2 = shippingDetails.address.line2;
        updateData.shipping_city = shippingDetails.address.city;
        updateData.shipping_postal_code = shippingDetails.address.postal_code;
        updateData.shipping_state = shippingDetails.address.state;
        updateData.shipping_phone = shippingDetails.phone;
      }

      const { error: updErr } = await supabaseService
        .from("orders")
        .update(updateData)
        .eq("id", order.id);
      if (updErr) throw updErr;
    }

    // Si payé, décrémenter le stock
    if (newStatus === "paid") {
      const { data: items, error: itErr } = await supabaseService
        .from("order_items")
        .select("product_id, quantity, unit_price_cents")
        .eq("order_id", order.id);
      if (itErr) throw itErr;

      const productIds = items.map((i) => i.product_id);
      const { data: prods, error: pErr } = await supabaseService
        .from("products")
        .select("id, stock, name")
        .in("id", productIds);
      if (pErr) throw pErr;
      const pMap = new Map<string, { stock: number; name: string }>();
      for (const p of prods) pMap.set(p.id, { stock: p.stock ?? 0, name: p.name });

      for (const it of items) {
        const current = pMap.get(it.product_id)?.stock ?? 0;
        const next = Math.max(0, current - it.quantity);
        const { error: uErr } = await supabaseService
          .from("products")
          .update({ stock: next })
          .eq("id", it.product_id);
        if (uErr) throw uErr;
      }

      // Send notification emails if RESEND_API_KEY is available
      if (RESEND_API_KEY) {
        // Fetch order details for email
        const { data: orderDetails } = await supabaseService
          .from("orders")
          .select("id, customer_email, amount_cents, currency, shipping_country, shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_postal_code, shipping_state, shipping_phone")
          .eq("id", order.id)
          .single();

        const formatEur = (cents: number) => `${(cents / 100).toFixed(2)}€`;

        // Build order items HTML for admin email
        const orderItemsHtml = items.map((it) => {
          const product = pMap.get(it.product_id);
          const itemTotal = it.unit_price_cents * it.quantity;
          return `
            <tr>
              <td style="padding:8px">${product?.name || 'Produit'}</td>
              <td style="padding:8px;text-align:center">${it.quantity}</td>
              <td style="padding:8px;text-align:right">${formatEur(it.unit_price_cents)}</td>
              <td style="padding:8px;text-align:right">${formatEur(itemTotal)}</td>
            </tr>
          `;
        }).join("");

        // Email to admin
        const htmlAdmin = `
          <h2>Nouvelle commande payée #${order.id.slice(0, 8)}</h2>
          <p><strong>Statut:</strong> Paiement confirmé ✓</p>
          <h3>Détails de la commande</h3>
          <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
            <thead>
              <tr style="background:#f5f5f5">
                <th style="padding:8px;text-align:left;font-weight:bold">Produit</th>
                <th style="padding:8px;text-align:center;font-weight:bold">Quantité</th>
                <th style="padding:8px;text-align:right;font-weight:bold">Prix unitaire</th>
                <th style="padding:8px;text-align:right;font-weight:bold">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <p><strong>Montant total:</strong> ${formatEur(orderDetails?.amount_cents ?? 0)}</p>
          <p><strong>Email client:</strong> ${orderDetails?.customer_email}</p>
          <h3>Adresse de livraison</h3>
          <div style="background:#f5f5f5;padding:12px;border-radius:4px;font-style:normal">
            ${orderDetails?.shipping_name ? `<p style="margin:0;font-weight:bold">${orderDetails.shipping_name}</p>` : ''}
            ${orderDetails?.shipping_address_line1 ? `<p style="margin:0">${orderDetails.shipping_address_line1}</p>` : ''}
            ${orderDetails?.shipping_address_line2 ? `<p style="margin:0">${orderDetails.shipping_address_line2}</p>` : ''}
            ${orderDetails?.shipping_postal_code || orderDetails?.shipping_city ? `<p style="margin:0">${[orderDetails?.shipping_postal_code, orderDetails?.shipping_city].filter(Boolean).join(' ')}</p>` : ''}
            ${orderDetails?.shipping_country ? `<p style="margin:0;font-weight:bold">${orderDetails.shipping_country.toUpperCase()}</p>` : ''}
            ${orderDetails?.shipping_phone ? `<p style="margin:4px 0 0">📞 ${orderDetails.shipping_phone}</p>` : ''}
          </div>
          <p style="margin-top:20px;color:#666">Veuillez préparer la commande et organiser la livraison.</p>
        `;

        // Email to customer
        const htmlCustomer = `
          <h2>Votre commande a bien été reçue ✓</h2>
          <p>Merci pour votre achat ! Votre paiement a été confirmé.</p>
          <h3>Récapitulatif de votre commande</h3>
          <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
            <thead>
              <tr style="background:#f5f5f5">
                <th style="padding:8px;text-align:left;font-weight:bold">Produit</th>
                <th style="padding:8px;text-align:center;font-weight:bold">Quantité</th>
                <th style="padding:8px;text-align:right;font-weight:bold">Prix unitaire</th>
                <th style="padding:8px;text-align:right;font-weight:bold">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <p style="background:#f5f5f5;padding:12px;border-radius:4px">
            <strong>Montant total:</strong> ${formatEur(orderDetails?.amount_cents ?? 0)}
          </p>
          <h3>Adresse de livraison</h3>
          <div style="background:#f5f5f5;padding:12px;border-radius:4px;font-style:normal;margin-bottom:16px">
            ${orderDetails?.shipping_name ? `<p style="margin:0;font-weight:bold">${orderDetails.shipping_name}</p>` : ''}
            ${orderDetails?.shipping_address_line1 ? `<p style="margin:0">${orderDetails.shipping_address_line1}</p>` : ''}
            ${orderDetails?.shipping_address_line2 ? `<p style="margin:0">${orderDetails.shipping_address_line2}</p>` : ''}
            ${orderDetails?.shipping_postal_code || orderDetails?.shipping_city ? `<p style="margin:0">${[orderDetails?.shipping_postal_code, orderDetails?.shipping_city].filter(Boolean).join(' ')}</p>` : ''}
            ${orderDetails?.shipping_country ? `<p style="margin:0;font-weight:bold">${orderDetails.shipping_country.toUpperCase()}</p>` : ''}
          </div>
          <p>Nous préparerons votre commande et vous enverrons les informations de livraison sous peu.</p>
          <p>Des questions ? Appelez-nous au <strong>+32 497 22 87 43</strong></p>
          <p>À bientôt sous les étoiles 🌟<br><strong>L'équipe Endless</strong></p>
        `;

        // Send email to admin
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Endless <no-reply@endless-tents.com>",
            to: ["info@endless-tents.com"],
            subject: `[Commande] ${order.id.slice(0, 8)} - ${formatEur(orderDetails?.amount_cents ?? 0)}`,
            html: htmlAdmin,
          }),
        }).catch(err => console.error("[verify-payment] Error sending admin email:", err));

        // Send email to customer
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Endless <no-reply@endless-tents.com>",
            to: [orderDetails?.customer_email || ""],
            subject: "Votre commande Endless a bien été reçue",
            html: htmlCustomer,
          }),
        }).catch(err => console.error("[verify-payment] Error sending customer email:", err));
      }
    }

    // Déterminer l'URL de redirection selon le statut
    let redirect_url = "";
    if (newStatus === "paid") {
      redirect_url = "/payment-success";
    } else if (newStatus === "canceled") {
      redirect_url = "/payment-canceled";  // Use US spelling to match Stripe's default
    } else {
      redirect_url = "/payment-error";
    }

    return new Response(JSON.stringify({ 
      order_id: order.id, 
      status: newStatus,
      redirect_url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: unknown) {
    console.error("[verify-payment] Error:", e instanceof Error ? e.message : String(e));
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});