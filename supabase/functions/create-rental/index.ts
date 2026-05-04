import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE, {
      auth: { persistSession: false },
    });

    const body = await req.json();
    const {
      start_date, end_date, days,
      product_id, product_name,
      insurance, annexe, roof_bars,
      price_base_cents, price_insurance_cents, price_annexe_cents,
      price_roof_bars_cents, price_total_cents,
      customer_name, customer_email, customer_phone, customer_message,
      user_id,
    } = body;

    if (!start_date || !end_date || !customer_name || !customer_email || !customer_phone) {
      return new Response(JSON.stringify({ error: "Champs obligatoires manquants" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: reservation, error: dbError } = await supabase
      .from("rental_reservations")
      .insert({
        start_date, end_date, days: days ?? 0,
        product_id: product_id || null,
        product_name: product_name || null,
        insurance: insurance ?? false,
        annexe: annexe ?? false,
        roof_bars: roof_bars ?? false,
        price_base_cents: price_base_cents ?? 0,
        price_insurance_cents: price_insurance_cents ?? 0,
        price_annexe_cents: price_annexe_cents ?? 0,
        price_roof_bars_cents: price_roof_bars_cents ?? 0,
        price_total_cents: price_total_cents ?? 0,
        deposit_cents: 50000,
        customer_name, customer_email, customer_phone,
        customer_message: customer_message || null,
        user_id: user_id || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError) throw dbError;

    if (RESEND_API_KEY) {
      const formatEur = (cents: number) => `${(cents / 100).toFixed(0)}€`;
      const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-BE", {
        day: "2-digit", month: "long", year: "numeric"
      });

      const optionsList = [
        insurance ? `Assurance tous risques : ${formatEur(price_insurance_cents)}` : null,
        annexe ? `Annexe : ${formatEur(price_annexe_cents)}` : null,
        roof_bars ? `Barres de toit : ${formatEur(price_roof_bars_cents)}` : null,
      ].filter(Boolean).map(o => `<li>${o}</li>`).join("") || "<li>Aucune option</li>";

      const htmlAdmin = `
        <h2>Nouvelle demande de location #${reservation.id.slice(0, 8)}</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Client</td><td style="padding:8px">${customer_name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${customer_email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px">${customer_phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Dates</td><td style="padding:8px">${formatDate(start_date)} → ${formatDate(end_date)} (${days} jour${days > 1 ? "s" : ""})</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Modèle</td><td style="padding:8px">${product_name || "Non spécifié"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Options</td><td style="padding:8px"><ul>${optionsList}</ul></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">${formatEur(price_base_cents)}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">TOTAL</td><td style="padding:8px;font-weight:bold">${formatEur(price_total_cents)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Caution</td><td style="padding:8px">500€</td></tr>
          ${customer_message ? `<tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${customer_message}</td></tr>` : ""}
        </table>
      `;

      const htmlClient = `
        <h2>Votre demande de location a bien été reçue ✓</h2>
        <p>Bonjour ${customer_name},</p>
        <p>Nous avons bien reçu votre demande. Notre équipe vous contactera dans les 24h pour confirmer.</p>
        <h3>Récapitulatif</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Dates</td><td style="padding:8px">${formatDate(start_date)} → ${formatDate(end_date)} (${days} jour${days > 1 ? "s" : ""})</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Modèle</td><td style="padding:8px">${product_name || "À confirmer"}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Total estimé</td><td style="padding:8px;font-weight:bold">${formatEur(price_total_cents)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Caution</td><td style="padding:8px">500€ (remboursée à la restitution)</td></tr>
        </table>
        <p>Des questions ? Appelez-nous au <strong>+32 497 22 87 43</strong></p>
        <p>À bientôt sous les étoiles 🌟<br><strong>L'équipe Endless</strong></p>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Endless <no-reply@endless-tents.com>",
          to: ["info@endless-tents.com"],
          subject: `[Location] ${customer_name} - ${formatDate(start_date)}`,
          html: htmlAdmin,
          reply_to: customer_email,
        }),
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Endless <no-reply@endless-tents.com>",
          to: [customer_email],
          subject: "Votre demande de location Endless a bien été reçue",
          html: htmlClient,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, reservation_id: reservation.id }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("[create-rental] Error:", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});