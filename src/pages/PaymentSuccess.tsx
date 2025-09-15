import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSecureStorage } from '@/hooks/useSecureStorage';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getGuestToken, clearGuestToken } = useSecureStorage();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      // If no session_id, redirect to home as this is not a valid success page
      navigate('/');
    }
  }, [searchParams, navigate]);

  const verifyPayment = async (sessionId: string) => {
    try {
      setVerificationStatus('loading');
      
      // Vérifier le statut du paiement
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      // Rediriger selon le statut
      if (data.status === 'canceled') {
        navigate('/payment-cancelled');
        return;
      } else if (data.status === 'failed') {
        navigate('/payment-error?error=Le paiement a échoué');
        return;
      } else if (data.status !== 'paid') {
        navigate('/payment-error?error=Statut de paiement inattendu');
        return;
      }

      // Si le paiement est réussi, récupérer les détails de la commande
      const guestToken = getGuestToken();
      if (guestToken) {
        try {
          const { data: orderResult } = await supabase.functions.invoke('get-order', {
            body: { token: guestToken }
          });
          
          if (orderResult?.order_id) {
            setOrderDetails(orderResult);
            clearGuestToken(); // Clear token after successful retrieval
          }
        } catch (error) {
          console.error('Failed to fetch order details:', error);
        }
      }

      setVerificationStatus('success');
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('error');
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-display text-primary mb-4">Vérification de votre paiement...</h1>
            <p className="text-muted-foreground">
              Nous vérifions le statut de votre commande, veuillez patienter.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-display text-destructive mb-4">Erreur de vérification</h1>
            <p className="text-muted-foreground mb-8">
              Nous n'avons pas pu vérifier votre paiement. Si votre carte a été débitée, 
              votre commande sera traitée et vous recevrez un email de confirmation.
            </p>
            <div className="space-y-4">
              <Link to="/contact">
                <Button className="bg-primary hover:bg-primary/90">
                  Contacter le support
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="ml-4">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'success':
      default:
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-display text-primary mb-4">Commande confirmée !</h1>
            <p className="text-large text-muted-foreground mb-8">
              Merci pour votre achat. Votre commande a été validée avec succès.
            </p>

            {orderDetails && (
              <Card className="shadow-card max-w-md mx-auto mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Détails de la commande</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commande :</span>
                      <span className="font-mono">#{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statut :</span>
                      <span className="text-primary font-medium">Confirmée</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">Prochaines étapes</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Vous recevrez un email de confirmation dans les prochaines minutes</li>
                  <li>• Notre équipe préparera votre commande sous 24-48h</li>
                  <li>• Vous recevrez un numéro de suivi dès l'expédition</li>
                  <li>• Livraison estimée : 3-5 jours ouvrables</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Nous contacter
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Des questions ? Contactez-nous à <strong>info@endless-tents.com</strong></p>
                <p>ou au <strong>+32 497 22 87 43</strong></p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="max-w-2xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;