import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft, MessageCircle } from 'lucide-react';

const PaymentError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') || 'Erreur de paiement inconnue';

  useEffect(() => {
    // Log the error for debugging
    console.error('Payment error:', error);
  }, [error]);

  const retryPayment = () => {
    // Navigate back to checkout to retry
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container mx-auto container-padding max-w-2xl">
          <div className="text-center">
            <Card className="shadow-card border-destructive/20">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      Erreur de paiement
                    </h1>
                    <p className="text-muted-foreground">
                      Une erreur est survenue lors du traitement de votre paiement.
                    </p>
                  </div>

                  <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg w-full">
                    <p className="text-sm text-destructive font-medium mb-1">
                      Détails de l'erreur :
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {error}
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Que faire maintenant ?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Vérifiez les informations de votre carte</li>
                      <li>• Assurez-vous d'avoir des fonds suffisants</li>
                      <li>• Contactez votre banque si le problème persiste</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour à l'accueil
                    </Button>
                    
                    <Button 
                      onClick={retryPayment}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Réessayer le paiement
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Besoin d'aide ?
                    </p>
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/contact')}
                      className="text-primary"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactez notre support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentError;