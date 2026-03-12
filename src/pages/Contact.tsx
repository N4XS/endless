import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { SEO, generateBreadcrumbSchema } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  firstname: z.string().trim().min(1, 'Prénom requis').max(100),
  lastname: z.string().trim().min(1, 'Nom requis').max(100),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().max(30).optional().or(z.literal('')),
  subject: z.string().optional().or(z.literal('')),
  vehicle: z.string().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message requis').max(5000),
});

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', phone: '', subject: '', vehicle: '', message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { type: 'contact', data: result.data },
      });

      if (error) throw error;

      toast({
        title: "Message envoyé ✓",
        description: "Nous vous répondrons dans les 24h.",
      });
      setFormData({ firstname: '', lastname: '', email: '', phone: '', subject: '', vehicle: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact"
        description="Contactez l'équipe ENDLESS pour toute question sur nos tentes de toit. Conseil personnalisé, installation et service après-vente à Namur, Belgique."
        canonical="/contact"
        structuredData={breadcrumbSchema}
      />
      <Header />

      <main className="container mx-auto container-padding py-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-primary mb-4">Contactez-nous</h1>
          <p className="text-large text-muted-foreground max-w-2xl mx-auto">
            Une question ? Besoin d'un conseil ? Notre équipe d'experts est à votre disposition.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname">Prénom *</Label>
                      <Input id="firstname" placeholder="Jean" value={formData.firstname} onChange={(e) => handleChange('firstname', e.target.value)} />
                      {errors.firstname && <p className="text-sm text-destructive mt-1">{errors.firstname}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastname">Nom *</Label>
                      <Input id="lastname" placeholder="Dupont" value={formData.lastname} onChange={(e) => handleChange('lastname', e.target.value)} />
                      {errors.lastname && <p className="text-sm text-destructive mt-1">{errors.lastname}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="jean@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+32 123 45 67 89" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <select id="subject" value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="info">Demande d'informations</option>
                      <option value="conseil">Conseil pour choisir</option>
                      <option value="installation">Installation / Montage</option>
                      <option value="location">Location</option>
                      <option value="sav">Service après-vente</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="vehicle">Véhicule (optionnel)</Label>
                    <Input id="vehicle" placeholder="Marque, modèle, année" value={formData.vehicle} onChange={(e) => handleChange('vehicle', e.target.value)} />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Décrivez votre projet, vos besoins, vos questions..." rows={5} value={formData.message} onChange={(e) => handleChange('message', e.target.value)} />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <><Send className="w-4 h-4 mr-2 animate-pulse" />Envoi en cours...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" />Envoyer le message</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-muted-foreground">Namur, 5000 Belgique</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">L'adresse exacte de l'entrepôt vous sera communiquée lors de votre réservation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <a href="tel:+32497228743" className="text-muted-foreground hover:text-primary transition-colors">+32 497 22 87 43</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:info@endless-tents.com" className="text-muted-foreground hover:text-primary transition-colors">info@endless-tents.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.1234567890123!2d4.8666767!3d50.4654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzU1LjYiTiA0wrA1MSc1Ni4wIkU!5e0!3m2!1sfr!2sbe!4v1234567890123!5m2!1sfr!2sbe"
                  width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" className="rounded-lg"
                  title="Localisation ENDLESS - Namur, Belgique"
                />
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Réponse garantie</h3>
                <p className="text-primary-foreground/90 mb-4">Nous nous engageons à répondre à tous les messages dans les 24h</p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Réponse sous 24h maximum</span>
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

export default Contact;
