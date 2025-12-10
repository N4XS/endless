import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useSecureStorage } from '@/hooks/useSecureStorage';
import { supabase } from '@/integrations/supabase/client';
import { SafariPaymentFallback } from '@/components/SafariPaymentFallback';
import { DiscountCodeInput } from '@/components/DiscountCodeInput';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, finalPrice, clearCart, discountCode, setDiscountCode } = useCart();
  const { toast } = useToast();
  const { storeGuestToken } = useSecureStorage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSafariFallback, setShowSafariFallback] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string>('');
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    country: 'BE'
  });

  const countries = [
    { code: 'BE', name: 'Belgique' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'LU', name: 'Luxembourg' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Redirection simplifiée et robuste vers Stripe
  const performStripeRedirect = (url: string) => {
    console.log('Redirecting to Stripe checkout:', url);
    setStripeUrl(url);
    setRedirectAttempts(prev => prev + 1);
    
    // Méthode de redirection unifiée et simple
    try {
      // Redirection directe - fonctionne sur tous les navigateurs modernes
      window.location.href = url;
    } catch (error) {
      console.error('Redirect error:', error);
      // Fallback en cas d'erreur
      setShowSafariFallback(true);
    }
    
    // Timeout de sécurité pour détecter les échecs de redirection
    setTimeout(() => {
      if (!document.hidden) {
        console.log('Redirect timeout - showing manual fallback');
        setShowSafariFallback(true);
      }
    }, 3000);
  };

  const retryRedirect = () => {
    setShowSafariFallback(false);
    if (stripeUrl) {
      performStripeRedirect(stripeUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles avant de continuer.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare items for the payment API
      const paymentItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: paymentItems,
          shipping_country: formData.country,
          customer_email: formData.email,
          discount_code_id: discountCode?.id || null
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Store guest token if provided for order tracking
        if (data.guest_token) {
          console.log('Storing guest token for order tracking');
          storeGuestToken(data.guest_token);
        }
        
        console.log('Stripe checkout URL received:', data.url);
        
        // Utiliser la nouvelle stratégie de redirection
        performStripeRedirect(data.url);
      } else {
        throw new Error('Aucune URL de paiement reçue');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors de la création de la session de paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container mx-auto container-padding">
          <h1 className="text-display text-primary mb-8">Finaliser la commande</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Informations de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Adresse email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Pays de livraison *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground">
                        ✓ L'adresse de livraison complète sera collectée de manière sécurisée par Stripe lors du paiement.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Votre commande</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between">
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-muted-foreground">Qté: {item.quantity}</div>
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      
                      <DiscountCodeInput
                        orderAmountCents={Math.round(totalPrice * 100)}
                        onDiscountApplied={setDiscountCode}
                        appliedDiscount={discountCode}
                      />
                      
                      {discountCode && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction ({discountCode.code})</span>
                          <span>-{formatPrice(discountCode.discountAmountCents / 100)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Frais de livraison</span>
                        <span>Calculés automatiquement</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(finalPrice)} + frais
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-primary hover:bg-primary/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirection vers Stripe...
                        </>
                      ) : (
                        'Procéder au paiement'
                      )}
                    </Button>

                    {showSafariFallback && stripeUrl && (
                      <div className="mt-4">
                        <SafariPaymentFallback 
                          stripeUrl={stripeUrl} 
                          onRetry={retryRedirect}
                        />
                      </div>
                    )}

                    <div className="mt-4 text-xs text-muted-foreground text-center">
                      <p>Paiement sécurisé par Stripe</p>
                      <p>Vous serez redirigé vers notre plateforme de paiement sécurisée</p>
                      
                      {redirectAttempts > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tentatives de redirection: {redirectAttempts}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;