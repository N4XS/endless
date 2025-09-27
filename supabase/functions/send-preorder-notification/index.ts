import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PreorderNotificationRequest {
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, productName, quantity }: PreorderNotificationRequest = await req.json();

    console.log('Sending preorder notification:', { customerName, customerEmail, productName, quantity });

    // Send email notification to admin
    const emailResponse = await resend.emails.send({
      from: "Starzz Tentes <onboarding@resend.dev>",
      to: ["contact@starzztentes.com"], // Replace with your actual email
      subject: `Nouvelle précommande - ${productName}`,
      html: `
        <h1>Nouvelle précommande reçue</h1>
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <p><strong>Détails de la précommande :</strong></p>
          <ul>
            <li><strong>Client :</strong> ${customerName}</li>
            <li><strong>Email :</strong> ${customerEmail}</li>
            <li><strong>Produit :</strong> ${productName}</li>
            <li><strong>Quantité :</strong> ${quantity}</li>
            <li><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
          </ul>
          <p>Connectez-vous à votre tableau de bord pour traiter cette précommande.</p>
        </div>
      `,
    });

    console.log("Preorder notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-preorder-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);