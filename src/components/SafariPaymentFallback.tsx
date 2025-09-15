import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Smartphone, AlertCircle } from 'lucide-react';

interface SafariPaymentFallbackProps {
  stripeUrl: string;
  onRetry: () => void;
}

export const SafariPaymentFallback = ({ stripeUrl, onRetry }: SafariPaymentFallbackProps) => {
  const [manualRedirectAttempted, setManualRedirectAttempted] = useState(false);

  const handleManualRedirect = () => {
    setManualRedirectAttempted(true);
    console.log('Manual Safari redirect attempt:', stripeUrl);
    
    try {
      // Method 1: Direct window.location
      window.location.href = stripeUrl;
    } catch (error) {
      console.error('Manual redirect failed:', error);
      
      // Method 2: Try with window.open as fallback
      try {
        window.open(stripeUrl, '_self');
      } catch (secondError) {
        console.error('Window.open fallback failed:', secondError);
      }
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-2">
              Problème de redirection Safari détecté
            </h3>
            <p className="text-orange-700 mb-4 text-sm">
              Safari sur mobile peut bloquer les redirections automatiques. 
              Utilisez le bouton ci-dessous pour ouvrir la page de paiement manuellement.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleManualRedirect}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ouvrir la page de paiement Stripe
              </Button>
              
              {manualRedirectAttempted && (
                <div className="p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Instructions Safari mobile:
                    </span>
                  </div>
                  <ul className="text-xs text-orange-700 space-y-1 ml-6 list-disc">
                    <li>Si une popup s'affiche, autorisez la redirection</li>
                    <li>Si rien ne se passe, copiez l'URL et collez-la dans un nouvel onglet</li>
                    <li>Vérifiez que les popups ne sont pas bloquées dans Safari</li>
                  </ul>
                  
                  <div className="mt-3 p-2 bg-white rounded border border-orange-300">
                    <p className="text-xs text-orange-600 mb-1">URL de paiement:</p>
                    <code className="text-xs break-all text-orange-800 select-all">
                      {stripeUrl}
                    </code>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={onRetry}
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Réessayer la redirection automatique
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};