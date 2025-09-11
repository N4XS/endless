import { useCallback } from 'react';

// Secure token storage with encryption-like obfuscation
const STORAGE_KEY = 'guest_order_token';

// Generate a session-specific encryption key
const generateSessionKey = (): string => {
  const sessionId = sessionStorage.getItem('session_id') || 
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('session_id', id);
      return id;
    })();
  return `starzz-${sessionId}-${Date.now()}`;
};

const ENCRYPTION_KEY = generateSessionKey();

// Simple XOR encryption for client-side token obfuscation
function obfuscate(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
}

function deobfuscate(encoded: string, key: string): string {
  try {
    const text = atob(encoded); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return '';
  }
}

export const useSecureStorage = () => {
  const storeGuestToken = useCallback((token: string) => {
    if (!token) return;
    
    try {
      const obfuscatedToken = obfuscate(token, ENCRYPTION_KEY);
      localStorage.setItem(STORAGE_KEY, obfuscatedToken);
      
      // Set expiration (24 hours)
      const expiry = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(`${STORAGE_KEY}_expiry`, expiry.toString());
    } catch (error) {
      console.error('Failed to store guest token:', error);
    }
  }, []);

  const getGuestToken = useCallback((): string | null => {
    try {
      const expiry = localStorage.getItem(`${STORAGE_KEY}_expiry`);
      if (!expiry || Date.now() > parseInt(expiry)) {
        // Token expired, clean up
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(`${STORAGE_KEY}_expiry`);
        return null;
      }

      const obfuscatedToken = localStorage.getItem(STORAGE_KEY);
      if (!obfuscatedToken) return null;

      return deobfuscate(obfuscatedToken, ENCRYPTION_KEY);
    } catch (error) {
      console.error('Failed to retrieve guest token:', error);
      return null;
    }
  }, []);

  const clearGuestToken = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_expiry`);
    } catch (error) {
      console.error('Failed to clear guest token:', error);
    }
  }, []);

  return {
    storeGuestToken,
    getGuestToken,
    clearGuestToken
  };
};