import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Tag, ShieldAlert } from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_cents: number;
  max_uses?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  active: boolean;
  description?: string;
  created_at: string;
}

const AdminDiscountCodes = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_order_cents: '0',
    max_uses: '',
    valid_until: '',
    description: '',
    active: true
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Veuillez vous connecter');
        navigate('/auth');
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc('is_admin');
      
      if (error || !isAdmin) {
        toast.error('Accès non autorisé');
        navigate('/');
        return;
      }

      setIsAuthorized(true);
      fetchCodes();
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast.error('Erreur de vérification des droits');
      navigate('/');
    }
  };

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data as DiscountCode[] || []);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      toast.error('Erreur lors du chargement des codes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.value) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const codeData = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseInt(formData.value),
        min_order_cents: parseInt(formData.min_order_cents) || 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_until: formData.valid_until || null,
        description: formData.description || null,
        active: formData.active
      };

      let error;
      if (editingCode) {
        ({ error } = await supabase
          .from('discount_codes')
          .update(codeData)
          .eq('id', editingCode.id));
      } else {
        ({ error } = await supabase
          .from('discount_codes')
          .insert(codeData));
      }

      if (error) throw error;

      toast.success(editingCode ? 'Code modifié avec succès' : 'Code créé avec succès');
      setShowForm(false);
      setEditingCode(null);
      resetForm();
      fetchCodes();
    } catch (error: any) {
      console.error('Error saving discount code:', error);
      if (error.code === '23505') {
        toast.error('Ce code existe déjà');
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    }
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      value: code.value.toString(),
      min_order_cents: code.min_order_cents.toString(),
      max_uses: code.max_uses?.toString() || '',
      valid_until: code.valid_until ? code.valid_until.split('T')[0] : '',
      description: code.description || '',
      active: code.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code ?')) return;

    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Code supprimé avec succès');
      fetchCodes();
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_order_cents: '0',
      max_uses: '',
      valid_until: '',
      description: '',
      active: true
    });
  };

  const formatValue = (code: DiscountCode) => {
    return code.type === 'percentage' ? `${code.value}%` : `${code.value}€`;
  };

  const isExpired = (code: DiscountCode) => {
    return code.valid_until && new Date(code.valid_until) < new Date();
  };

  const isExhausted = (code: DiscountCode) => {
    return code.max_uses && code.used_count >= code.max_uses;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
        <p className="text-muted-foreground">Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Codes de Réduction</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Code
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCode ? 'Modifier le Code' : 'Nouveau Code de Réduction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="NOEL2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value">
                    Valeur * {formData.type === 'percentage' ? '(%)' : '(€)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    placeholder={formData.type === 'percentage' ? '10' : '50'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_order">Commande minimum (€)</Label>
                  <Input
                    id="min_order"
                    type="number"
                    value={(parseInt(formData.min_order_cents) / 100).toString()}
                    onChange={(e) => setFormData({...formData, min_order_cents: (parseFloat(e.target.value || '0') * 100).toString()})}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="max_uses">Utilisations maximum</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                    placeholder="Illimité"
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Date d'expiration</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du code de réduction"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="active">Code actif</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCode ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingCode(null);
                  resetForm();
                }}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {codes.map((code) => (
          <Card key={code.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-lg">
                      <Tag className="w-4 h-4 mr-1" />
                      {code.code}
                    </Badge>
                    <Badge variant={code.active && !isExpired(code) && !isExhausted(code) ? "default" : "secondary"}>
                      {code.active && !isExpired(code) && !isExhausted(code) ? 'Actif' : 'Inactif'}
                    </Badge>
                    {isExpired(code) && <Badge variant="destructive">Expiré</Badge>}
                    {isExhausted(code) && <Badge variant="destructive">Épuisé</Badge>}
                  </div>
                  
                  <p className="text-lg font-semibold">
                    Réduction : {formatValue(code)}
                  </p>
                  
                  {code.min_order_cents > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Commande minimum : {(code.min_order_cents / 100).toFixed(2)}€
                    </p>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    Utilisations : {code.used_count}{code.max_uses ? ` / ${code.max_uses}` : ' (illimité)'}
                  </p>
                  
                  {code.valid_until && (
                    <p className="text-sm text-muted-foreground">
                      Expire le : {new Date(code.valid_until).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  
                  {code.description && (
                    <p className="text-sm">{code.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(code)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(code.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {codes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun code de réduction</h3>
              <p className="text-muted-foreground mb-4">Créez votre premier code de réduction pour commencer.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDiscountCodes;