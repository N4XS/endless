import { useCallback } from 'react';
import { testStorageCompatibility } from '@/utils/browser';

// Obfuscation simple côté client pour éviter l'exposition directe du token
// Note: Ce n'est PAS une sécurité absolue, mais une obfuscation basique

const generateSessionKey = (): string => {
  // Test de compatibilité du storage d'abord
  const compatibility = testStorageCompatibility();
  
  if (compatibility.sessionStorage) {
    const sessionData = sessionStorage.getItem('session-key') || 
      `${Date.now()}-${Math.random().toString(36)}`;
    
    if (!sessionStorage.getItem('session-key')) {
      sessionStorage.setItem('session-key', sessionData);
    }
    return sessionData;
  }
  
  // Fallback pour Safari strict: utiliser une clé basée sur le timestamp
  return `${Date.now()}-fallback`;
};

const ENCRYPTION_KEY = generateSessionKey();

// Obfuscation avec XOR simple + Base64
const obfuscate = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return btoa(result); // Base64 encode
};

// Désofuscation
const deobfuscate = (encoded: string, key: string): string => {
  try {
    const decoded = atob(encoded); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const encodedChar = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(encodedChar ^ keyChar);
    }
    return result;
  } catch {
    return '';
  }
};

// Storage avec fallback pour Safari
const safariCompatibleStorage = {
  setItem: (key: string, value: string): boolean => {
    const compatibility = testStorageCompatibility();
    
    try {
      if (compatibility.localStorage) {
        localStorage.setItem(key, value);
        return true;
      } else if (compatibility.sessionStorage) {
        sessionStorage.setItem(key, value);
        return true;
      } else if (compatibility.cookies) {
        // Fallback cookies pour Safari strict
        const expires = new Date();
        expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24h
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  
  getItem: (key: string): string | null => {
    const compatibility = testStorageCompatibility();
    
    try {
      if (compatibility.localStorage) {
        return localStorage.getItem(key);
      } else if (compatibility.sessionStorage) {
        return sessionStorage.getItem(key);
      } else if (compatibility.cookies) {
        // Lecture depuis les cookies
        const name = key + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  
  removeItem: (key: string): boolean => {
    const compatibility = testStorageCompatibility();
    
    try {
      if (compatibility.localStorage) {
        localStorage.removeItem(key);
      }
      if (compatibility.sessionStorage) {
        sessionStorage.removeItem(key);
      }
      if (compatibility.cookies) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      return true;
    } catch {
      return false;
    }
  }
};

export const useSecureStorage = () => {
  const storeGuestToken = useCallback((token: string) => {
    try {
      const obfuscatedToken = obfuscate(token, ENCRYPTION_KEY);
      const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 heures
      
      const success1 = safariCompatibleStorage.setItem('guest_token', obfuscatedToken);
      const success2 = safariCompatibleStorage.setItem('guest_token_expiry', expiry.toString());
      
      if (success1 && success2) {
        console.log('Guest token stored securely');
      } else {
        console.warn('Storage may have failed on this browser');
      }
    } catch (error) {
      console.error('Failed to store guest token:', error);
    }
  }, []);

  const getGuestToken = useCallback((): string | null => {
    try {
      const stored = safariCompatibleStorage.getItem('guest_token');
      const expiry = safariCompatibleStorage.getItem('guest_token_expiry');
      
      if (!stored || !expiry) {
        return null;
      }
      
      // Vérifier l'expiration
      if (Date.now() > parseInt(expiry)) {
        safariCompatibleStorage.removeItem('guest_token');
        safariCompatibleStorage.removeItem('guest_token_expiry');
        console.log('Guest token expired, removed');
        return null;
      }
      
      const deobfuscatedToken = deobfuscate(stored, ENCRYPTION_KEY);
      return deobfuscatedToken || null;
    } catch (error) {
      console.error('Failed to retrieve guest token:', error);
      return null;
    }
  }, []);

  const clearGuestToken = useCallback(() => {
    try {
      safariCompatibleStorage.removeItem('guest_token');
      safariCompatibleStorage.removeItem('guest_token_expiry');
      console.log('Guest token cleared');
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