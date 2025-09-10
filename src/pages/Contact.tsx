import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Car } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto container-padding py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-display text-sapin mb-4">Contactez-nous</h1>
          <p className="text-large text-muted-foreground max-w-2xl mx-auto">
            Une question ? Besoin d'un conseil ? Notre équipe d'experts est à votre disposition.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sapin">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">Prénom *</Label>
                    <Input id="firstname" placeholder="Jean" />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Nom *</Label>
                    <Input id="lastname" placeholder="Dupont" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="jean@example.com" />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+32 123 45 67 89" />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <select id="subject" className="w-full p-2 border border-border rounded-md">
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
                  <Input id="vehicle" placeholder="Marque, modèle, année" />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre projet, vos besoins, vos questions..."
                    rows={5}
                  />
                </div>

                <Button size="lg" className="w-full bg-sapin hover:bg-sapin/90">
                  Envoyer le message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Coordonnées */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sapin">Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-ambre mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-muted-foreground">
                      Namur, 5000 Belgique
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-ambre mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <a 
                      href="tel:0497228743"
                      className="text-muted-foreground hover:text-sapin transition-colors"
                    >
                      0497 22 87 43
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-ambre mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:info@endless-tents.com"
                      className="text-muted-foreground hover:text-sapin transition-colors"
                    >
                      info@endless-tents.com
                    </a>
                  </div>
                </div>

              </CardContent>
            </Card>


            {/* Carte interactive */}
            <Card className="shadow-card">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.1234567890123!2d4.8666767!3d50.4654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzU1LjYiTiA0wrA1MSc1Ni4wIkU!5e0!3m2!1sfr!2sbe!4v1234567890123!5m2!1sfr!2sbe"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Localisation ENDLESS - Namur, Belgique"
                ></iframe>
              </CardContent>
            </Card>

            {/* Réponse rapide */}
            <Card className="bg-olive text-secondary-foreground">
              <CardContent className="pt-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Réponse garantie</h3>
                <p className="text-secondary-foreground/90 mb-4">
                  Nous nous engageons à répondre à tous les messages dans les 24h
                </p>
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