import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Log the cancellation for analytics
    console.log('Payment cancelled by user');
  }, []);

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
                    <XCircle className="w-8 h-8 text-destructive" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      Paiement annulé
                    </h1>
                    <p className="text-muted-foreground">
                      Votre paiement a été annulé. Aucun montant n'a été débité.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Votre panier est toujours disponible. Vous pouvez reprendre votre commande à tout moment.
                    </p>
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
                      onClick={() => navigate('/cart')}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Voir mon panier
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Une question sur votre commande ?
                    </p>
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/contact')}
                      className="text-primary"
                    >
                      Contactez-nous
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

export default PaymentCancelled;