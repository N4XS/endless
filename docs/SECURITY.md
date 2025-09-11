# Security Guidelines

## Overview

This document outlines the security practices and guidelines for the ENDLESS Tents project.

## Security Features Implemented

### 1. Database Security
- **Row Level Security (RLS)**: All sensitive tables have RLS enabled
- **Strict Policies**: Only authorized users can access their own data
- **Service Role Access**: Backend functions use service role for secure operations
- **Guest Token System**: Secure access mechanism for guest orders

### 2. Authentication Security
- **Supabase Auth**: Using industry-standard authentication
- **JWT Tokens**: Secure session management
- **Password Protection**: Enable "Leaked Password Protection" in Supabase Dashboard
- **Rate Limiting**: Protection against brute force attacks

### 3. Payment Security
- **Stripe Integration**: PCI-compliant payment processing
- **No Card Storage**: Card details never stored in our database
- **Secure Webhooks**: Payment verification through secure endpoints

### 4. Data Protection
- **Input Sanitization**: All user inputs are sanitized
- **XSS Prevention**: No dangerous HTML injection
- **CSRF Protection**: State-based request verification

## Manual Security Configuration

### Supabase Dashboard Settings

1. **Enable Leaked Password Protection**:
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Leaked Password Protection"
   - This prevents users from using compromised passwords

2. **Review Auth Settings**:
   - Check session timeout settings
   - Verify email confirmation requirements
   - Review password policy settings

## Security Monitoring

The project includes built-in security monitoring:

```typescript
import { securityMonitor } from '@/utils/security';

// Log security events
securityMonitor.logEvent({
  type: 'auth_failure',
  userId: 'user-id',
  details: 'Failed login attempt'
});

// Check for suspicious activity
const isSuspicious = securityMonitor.detectSuspiciousActivity(userId, ip);
```

## Best Practices

### For Developers

1. **Never use `dangerouslySetInnerHTML`** without proper sanitization
2. **Always validate user input** on both client and server
3. **Use TypeScript** for type safety
4. **Follow the principle of least privilege** for database access
5. **Sanitize all user inputs** using provided utilities

### For Authentication

1. **Use strong passwords** - minimum 8 characters with mixed case, numbers, symbols
2. **Enable MFA** when available
3. **Regular session cleanup** - sign out from unused devices
4. **Monitor account activity** - review login attempts

### For Database Access

1. **Always use RLS policies** for new tables
2. **Test policies thoroughly** with different user scenarios
3. **Use parameterized queries** to prevent SQL injection
4. **Audit database access** regularly

## Security Utilities

### Input Sanitization
```typescript
import { sanitizeInput } from '@/utils/security';

const cleanInput = sanitizeInput(userInput);
```

### Rate Limiting
```typescript
import { rateLimiter } from '@/utils/security';

if (!rateLimiter.isAllowed(userIp)) {
  throw new Error('Too many requests');
}
```

### Email Validation
```typescript
import { isValidEmail } from '@/utils/security';

if (!isValidEmail(email)) {
  throw new Error('Invalid email format');
}
```

## Incident Response

If you suspect a security issue:

1. **Immediately revoke access** if possible
2. **Document the incident** with timestamps and details
3. **Check security logs** using the monitoring utilities
4. **Update credentials** if compromised
5. **Review and update security policies** as needed

## Security Checklist

- [ ] RLS enabled on all sensitive tables
- [ ] Leaked Password Protection enabled in Supabase
- [ ] All user inputs sanitized
- [ ] No `dangerouslySetInnerHTML` without proper safety measures
- [ ] Rate limiting implemented on sensitive endpoints
- [ ] Security monitoring in place
- [ ] Regular security reviews scheduled
- [ ] Emergency procedures documented

## Contact

For security-related concerns or to report vulnerabilities, contact the development team immediately.

---

*Last updated: 2025-01-11*
*Security Review Score: 8.5/10*