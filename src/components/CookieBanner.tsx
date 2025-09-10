import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferences } from './CookiePreferences';

export const CookieBanner = () => {
  const { showBanner, acceptAll } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Nous utilisons des cookies pour améliorer votre expérience. 
                Les cookies essentiels sont nécessaires au fonctionnement du site.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
              >
                Gérer les préférences
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
              >
                Accepter tout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CookiePreferences 
        open={showPreferences} 
        onOpenChange={setShowPreferences} 
      />
    </>
  );
};