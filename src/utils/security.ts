/**
 * Security utilities for monitoring and logging security events
 */

export interface SecurityEvent {
  type: 'auth_failure' | 'auth_success' | 'auth_attempt' | 'suspicious_activity' | 'rate_limit' | 'invalid_access' | 'data_access' | 'security_alert';
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: string;
  message?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory

  /**
   * Log a security event
   */
  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('[Security Event]', securityEvent);
    }

    // Send to monitoring service
    this.reportToMonitoringService(securityEvent);
  }

  /**
   * Get recent security events
   */
  getEvents(type?: SecurityEvent['type'], limit = 50): SecurityEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }

    return filtered.slice(-limit);
  }

  /**
   * Check for suspicious patterns
   */
  detectSuspiciousActivity(userId?: string, ip?: string): boolean {
    const recentEvents = this.events.filter(
      event => 
        event.timestamp > new Date(Date.now() - 15 * 60 * 1000) && // Last 15 minutes
        (event.userId === userId || event.ip === ip)
    );

    // Too many failed attempts
    const failureCount = recentEvents.filter(
      event => event.type === 'auth_failure'
    ).length;

    return failureCount >= 5;
  }

  private async reportToMonitoringService(event: SecurityEvent) {
    // Store security events in Supabase for monitoring
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('security_logs').insert({
        event_type: event.type,
        user_id: event.userId || null,
        ip_address: event.ip || null,
        user_agent: event.userAgent || null,
        details: event.details,
        message: event.message || null,
        metadata: event.metadata || {}
      });
    } catch (error) {
      console.error('[Security Monitor] Failed to log event:', error);
    }
  }
}

export const securityMonitor = new SecurityMonitor();

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format with improved regex and debugging
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    console.warn('[Email Validation] Invalid input:', email);
    return false;
  }

  // More robust email regex that handles common email formats
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  const isValid = emailRegex.test(email.trim());
  
  // Debug logging in development
  if (import.meta.env.DEV && !isValid) {
    console.warn('[Email Validation] Rejected email:', email);
  }
  
  return isValid;
};

/**
 * Validate email with HTML5 fallback
 */
export const isValidEmailWithFallback = (email: string): boolean => {
  // First try our custom validation
  if (isValidEmail(email)) {
    return true;
  }
  
  // Fallback to HTML5 validation
  try {
    const tempInput = document.createElement('input');
    tempInput.type = 'email';
    tempInput.value = email;
    return tempInput.validity.valid;
  } catch (error) {
    console.warn('[Email Validation] HTML5 fallback failed:', error);
    return false;
  }
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if action is allowed for given key (IP, user ID, etc.)
   */
  isAllowed(key: string, maxAttempts = 10, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      securityMonitor.logEvent({
        type: 'rate_limit',
        details: `Rate limit exceeded for key: ${key}`,
      });
      return false;
    }

    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  /**
   * Clear attempts for a key (useful after successful auth)
   */
  clear(key: string) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
