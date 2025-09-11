import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Security-focused edge function for logging security events
// This function operates with service role privileges to insert into the protected security_logs table

interface SecurityEventRequest {
  event_type: 'auth_failure' | 'auth_success' | 'auth_attempt' | 'suspicious_activity' | 'rate_limit' | 'invalid_access' | 'data_access' | 'security_alert';
  details: string;
  message?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Basic CORS for internal function calls
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase with service role (bypasses RLS)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE, {
      auth: { persistSession: false }
    });

    // Parse request body
    const body: SecurityEventRequest = await req.json();
    
    // Validate required fields
    if (!body.event_type || !body.details) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: event_type, details" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract request metadata (no PII collected)
    const clientIP = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Insert security log (service role bypasses RLS policies)
    const { error } = await supabase
      .from("security_logs")
      .insert({
        event_type: body.event_type,
        user_id: null, // Intentionally anonymized for security compliance
        ip_address: clientIP,
        user_agent: userAgent,
        details: body.details,
        message: body.message || null,
        metadata: body.metadata || {}
      });

    if (error) {
      console.error("[log-security-event] Database error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[log-security-event] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});