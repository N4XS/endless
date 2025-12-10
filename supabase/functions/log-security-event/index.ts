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

// In-memory rate limiter (resets on function cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Allowed origins for this project
const ALLOWED_ORIGINS = [
  'https://gbkpdgchdkkydpzycfkr.lovableproject.com',
  'https://endless-tents.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080'
];

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIP);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  return false;
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed) || allowed === origin);
}

const VALID_EVENT_TYPES = [
  'auth_failure', 'auth_success', 'auth_attempt', 
  'suspicious_activity', 'rate_limit', 'invalid_access', 
  'data_access', 'security_alert'
];

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = {
    "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Extract client IP early for rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      console.warn(`[log-security-event] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
      });
    }

    // Check content length to prevent oversized payloads (max 10KB)
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 10240) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate event type
    if (!VALID_EVENT_TYPES.includes(body.event_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid event_type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate and sanitize input lengths
    const sanitizedDetails = String(body.details).slice(0, 1000);
    const sanitizedMessage = body.message ? String(body.message).slice(0, 500) : null;
    const sanitizedMetadata = body.metadata && typeof body.metadata === 'object' 
      ? JSON.parse(JSON.stringify(body.metadata).slice(0, 2000))
      : {};

    const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 500);

    // Insert security log (service role bypasses RLS policies)
    const { error } = await supabase
      .from("security_logs")
      .insert({
        event_type: body.event_type,
        user_id: null, // Intentionally anonymized for security compliance
        ip_address: clientIP.slice(0, 45), // Max IPv6 length
        user_agent: userAgent,
        details: sanitizedDetails,
        message: sanitizedMessage,
        metadata: sanitizedMetadata
      });

    if (error) {
      console.error("[log-security-event] Database error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[log-security-event] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
