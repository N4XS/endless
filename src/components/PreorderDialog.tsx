import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types';
import { Clock, AlertCircle } from 'lucide-react';

interface PreorderDialogProps {
  product: Product;
  children: React.ReactNode;
}

export const PreorderDialog: React.FC<PreorderDialogProps> = ({ product, children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerName: '',
    quantity: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerEmail || !formData.customerName) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('preorders')
        .insert({
          product_id: product.id,
          customer_email: formData.customerEmail,
          customer_name: formData.customerName,
          quantity: parseInt(formData.quantity),
          estimated_delivery: 'Mi-mars 2024'
        });

      if (error) throw error;

      toast.success('Précommande enregistrée avec succès ! Vous recevrez un email de confirmation.');
      setOpen(false);
      setFormData({
        customerEmail: '',
        customerName: '',
        quantity: '1'
      });
    } catch (error) {
      console.error('Error creating preorder:', error);
      toast.error('Erreur lors de l\'enregistrement de la précommande');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Précommander {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Produit temporairement en rupture de stock
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Nouvelle livraison prévue mi-mars 2024. Votre précommande sera prioritaire !
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                placeholder="Votre nom"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantité</Label>
            <Select value={formData.quantity} onValueChange={(value) => setFormData({...formData, quantity: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'tente' : 'tentes'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Prix unitaire :</span>
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total estimé :</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price * parseInt(formData.quantity))}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Aucun paiement requis maintenant. Nous vous contacterons pour finaliser votre commande.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Confirmer la précommande'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};