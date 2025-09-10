import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCookieConsent, CookiePreferences as CookiePrefsType } from '@/hooks/useCookieConsent';
import { Cookie, BarChart3, Target } from 'lucide-react';

interface CookiePreferencesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CookiePreferences = ({ open, onOpenChange }: CookiePreferencesProps) => {
  const { preferences, savePreferences, acceptAll, rejectAll } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePrefsType>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences, open]);

  const handleSave = () => {
    savePreferences(localPreferences);
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    onOpenChange(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    onOpenChange(false);
  };

  const cookieCategories = [
    {
      id: 'essential' as const,
      title: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site (navigation, panier, authentification)',
      icon: Cookie,
      required: true,
    },
    {
      id: 'analytics' as const,
      title: 'Cookies d\'analyse',
      description: 'Nous aident à comprendre comment vous utilisez notre site pour l\'améliorer',
      icon: BarChart3,
      required: false,
    },
    {
      id: 'marketing' as const,
      title: 'Cookies marketing',
      description: 'Utilisés pour personnaliser les publicités et mesurer leur efficacité',
      icon: Target,
      required: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Préférences des cookies</DialogTitle>
          <DialogDescription>
            Gérez vos préférences de cookies. Vous pouvez modifier ces paramètres à tout moment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-medium">
                        {category.title}
                      </Label>
                      {category.required && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Requis
                        </span>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={localPreferences[category.id]}
                    onCheckedChange={(checked) =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        [category.id]: checked,
                      }))
                    }
                    disabled={category.required}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {category.description}
                </p>
                {category.id !== 'marketing' && <Separator />}
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="flex-1 sm:flex-none"
            >
              Tout refuser
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none"
            >
              Tout accepter
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Enregistrer les préférences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};