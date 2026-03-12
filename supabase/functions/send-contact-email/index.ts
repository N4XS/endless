import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return new Response(JSON.stringify({ error: 'Missing type or data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let subject: string;
    let htmlContent: string;

    if (type === 'contact') {
      const { firstname, lastname, email, phone, subject: contactSubject, vehicle, message } = data;

      if (!firstname || !lastname || !email || !message) {
        return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const subjectLabels: Record<string, string> = {
        info: "Demande d'informations",
        conseil: 'Conseil pour choisir',
        installation: 'Installation / Montage',
        location: 'Location',
        sav: 'Service après-vente',
        autre: 'Autre',
      };

      subject = `[Contact] ${subjectLabels[contactSubject] || 'Nouveau message'} - ${firstname} ${lastname}`;
      htmlContent = `
        <h2>Nouveau message de contact</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Nom</td><td style="padding:8px">${firstname} ${lastname}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px">${phone}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold">Sujet</td><td style="padding:8px">${subjectLabels[contactSubject] || 'Non spécifié'}</td></tr>
          ${vehicle ? `<tr><td style="padding:8px;font-weight:bold">Véhicule</td><td style="padding:8px">${vehicle}</td></tr>` : ''}
        </table>
        <h3>Message</h3>
        <p style="white-space:pre-wrap">${message}</p>
      `;
    } else if (type === 'reservation') {
      const { dates, selectedTent, options, pricing, contact } = data;

      if (!contact?.name || !contact?.email || !contact?.phone || !dates?.start || !dates?.end) {
        return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      subject = `[Réservation] Location tente de toit - ${contact.name}`;
      htmlContent = `
        <h2>Nouvelle demande de réservation</h2>
        <h3>Dates</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Début</td><td style="padding:8px">${dates.start}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Fin</td><td style="padding:8px">${dates.end}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Durée</td><td style="padding:8px">${dates.days} jour(s)</td></tr>
        </table>
        <h3>Modèle</h3>
        <p>${selectedTent}</p>
        <h3>Options</h3>
        <ul>
          <li>Assurance tous risques: ${options.insurance ? 'Oui' : 'Non'}</li>
          <li>Annexe: ${options.annexe ? 'Oui' : 'Non'}</li>
          <li>Barres de toit: ${options.roofBars ? 'Oui' : 'Non'}</li>
        </ul>
        <h3>Tarification</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Location</td><td style="padding:8px">${pricing.base}€</td></tr>
          ${pricing.insurance > 0 ? `<tr><td style="padding:8px;font-weight:bold">Assurance</td><td style="padding:8px">${pricing.insurance}€</td></tr>` : ''}
          ${pricing.annexe > 0 ? `<tr><td style="padding:8px;font-weight:bold">Annexe</td><td style="padding:8px">${pricing.annexe}€</td></tr>` : ''}
          ${pricing.roofBars > 0 ? `<tr><td style="padding:8px;font-weight:bold">Barres de toit</td><td style="padding:8px">${pricing.roofBars}€</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold;border-top:2px solid #333">Total</td><td style="padding:8px;font-weight:bold;border-top:2px solid #333">${pricing.total}€</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Caution</td><td style="padding:8px">${pricing.deposit}€</td></tr>
        </table>
        <h3>Contact</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Nom</td><td style="padding:8px">${contact.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px">${contact.phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
        </table>
        ${contact.message ? `<h3>Message</h3><p style="white-space:pre-wrap">${contact.message}</p>` : ''}
      `;
    } else {
      return new Response(JSON.stringify({ error: 'Type invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send email to business
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ENDLESS <onboarding@resend.dev>',
        to: ['info@endless-tents.com'],
        subject,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend error:', errorData);
      throw new Error(`Resend API error [${resendResponse.status}]: ${errorData}`);
    }

    const result = await resendResponse.json();
    console.log('Email sent successfully:', result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erreur interne' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
