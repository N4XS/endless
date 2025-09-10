import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
    toast({
      title: "Panier mis à jour",
      description: "La quantité a été modifiée avec succès."
    });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Article retiré",
      description: `${productName} a été retiré du panier.`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-display text-primary mb-4">Votre panier est vide</h1>
              <p className="text-muted-foreground mb-8">
                Découvrez nos tentes de toit premium pour commencer votre aventure.
              </p>
              <Link to="/tentes">
                <Button className="bg-sapin hover:bg-sapin/90">
                  Voir nos tentes
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container mx-auto container-padding">
          <h1 className="text-display text-primary mb-8">
            Mon panier ({totalItems} {totalItems > 1 ? 'articles' : 'article'})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/api/placeholder/150/150'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-primary mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.product.description?.substring(0, 100)}...
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-lg text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} / unité
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-6">
                    Récapitulatif
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Livraison</span>
                      <span>Calculée à l'étape suivante</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Procéder au paiement
                    </Button>
                  </Link>

                  <Link to="/tentes" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Continuer mes achats
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;