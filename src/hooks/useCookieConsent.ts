import { useState, useEffect } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
};

const STORAGE_KEY = 'cookie-preferences';
const CONSENT_GIVEN_KEY = 'cookie-consent-given';

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedPreferences = localStorage.getItem(STORAGE_KEY);
    const consentGiven = localStorage.getItem(CONSENT_GIVEN_KEY);

    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }

    // Show banner if no consent has been given yet
    setShowBanner(!consentGiven);
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    const prefsWithEssential = { ...newPreferences, essential: true };
    setPreferences(prefsWithEssential);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsWithEssential));
    localStorage.setItem(CONSENT_GIVEN_KEY, 'true');
    setShowBanner(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  const hasConsent = (category: CookieCategory): boolean => {
    return preferences[category];
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONSENT_GIVEN_KEY);
    setPreferences(DEFAULT_PREFERENCES);
    setShowBanner(true);
  };

  return {
    preferences,
    showBanner,
    savePreferences,
    acceptAll,
    rejectAll,
    hasConsent,
    resetConsent,
  };
};