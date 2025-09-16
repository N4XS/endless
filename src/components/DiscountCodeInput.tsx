import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DiscountCodeInputProps {
  orderAmountCents: number;
  onDiscountApplied: (discount: {
    id: string;
    code: string;
    type: string;
    value: number;
    discountAmountCents: number;
  } | null) => void;
  appliedDiscount?: {
    id: string;
    code: string;
    type: string;
    value: number;
    discountAmountCents: number;
  } | null;
}

export const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  orderAmountCents,
  onDiscountApplied,
  appliedDiscount
}) => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCode = async () => {
    if (!code.trim()) return;

    setIsApplying(true);
    try {
      const { data, error } = await supabase.rpc('validate_discount_code', {
        code_text: code.trim(),
        order_amount_cents: orderAmountCents
      });

      if (error) throw error;

      const result = data?.[0];
      if (!result) {
        toast.error('Erreur lors de la validation du code');
        return;
      }

      if (result.valid) {
        onDiscountApplied({
          id: result.discount_id,
          code: code.trim().toUpperCase(),
          type: result.discount_type,
          value: result.discount_value,
          discountAmountCents: result.discount_amount_cents
        });
        toast.success(result.message);
        setCode('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error applying discount code:', error);
      toast.error('Erreur lors de l\'application du code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied(null);
    toast.success('Code de réduction retiré');
  };

  const formatDiscountDisplay = (discount: any) => {
    if (discount.type === 'percentage') {
      return `-${discount.value}%`;
    } else {
      return `-${(discount.discountAmountCents / 100).toFixed(2)}€`;
    }
  };

  return (
    <div className="space-y-3">
      {!appliedDiscount ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Code de réduction"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
            />
          </div>
          <Button 
            onClick={handleApplyCode}
            disabled={!code.trim() || isApplying}
            variant="outline"
          >
            {isApplying ? 'Application...' : 'Appliquer'}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {appliedDiscount.code}
            </span>
            <Badge variant="secondary" className="text-green-700 bg-green-100 dark:bg-green-900/30">
              {formatDiscountDisplay(appliedDiscount)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveDiscount}
            className="h-6 w-6 p-0 text-green-700 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};