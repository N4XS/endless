import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';

interface PreorderDialogProps {
  product: Product;
  children: React.ReactNode;
}

export const PreorderDialog: React.FC<PreorderDialogProps> = ({ product, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    quantity: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation (server also validates)
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedName) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      toast.error('Le nom doit contenir entre 2 et 100 caractères');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.quantity < 1 || formData.quantity > 10) {
      toast.error('La quantité doit être comprise entre 1 et 10');
      return;
    }

    setLoading(true);
    try {
      // Use secure edge function with server-side validation
      const { data, error } = await supabase.functions.invoke('create-preorder', {
        body: {
          product_id: product.id,
          customer_email: trimmedEmail,
          customer_name: trimmedName,
          quantity: formData.quantity
        }
      });

      if (error) throw error;
      
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success('Précommande enregistrée avec succès !', {
        description: 'Nous vous contacterons dès que le produit sera disponible.'
      });
      
      setIsOpen(false);
      setFormData({ email: '', name: '', quantity: 1 });
    } catch (error) {
      console.error('Error creating preorder:', error);
      toast.error('Erreur lors de la précommande');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Précommander {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{product.name}</h3>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Rupture de stock
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Disponible sous 2-3 semaines</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Avantages de la précommande
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>• Prix garanti au tarif actuel</li>
              <li>• Notification prioritaire dès la disponibilité</li>
              <li>• Installation comprise</li>
              <li>• Garantie constructeur 2 ans</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="5"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Confirmer la précommande'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Aucun paiement ne sera effectué maintenant. Nous vous contacterons pour finaliser votre commande.
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};