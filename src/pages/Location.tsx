import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Shield, MapPin, Phone, CheckCircle, Send } from 'lucide-react';
import { products } from '@/data/products';
import { SEO, generateServiceSchema, generateBreadcrumbSchema } from '@/components/SEO';

const Location = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [annexe, setAnnexe] = useState(false);
  const [roofBars, setRoofBars] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Dates requises",
        description: "Veuillez sélectionner les dates de début et de fin.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare reservation data
      const reservationData = {
        dates: {
          start: startDate,
          end: endDate,
          days: calculateDays()
        },
        selectedTent: selectedProduct ? products.find(p => p.id === selectedProduct)?.name : 'Non spécifiée',
        options: {
          insurance,
          annexe,
          roofBars
        },
        pricing: calculatePrice(),
        contact: formData,
        type: 'reservation'
      };

      // Create email body
      const emailBody = `
Nouvelle demande de réservation de tente de toit

DATES:
- Début: ${startDate}
- Fin: ${endDate}
- Durée: ${calculateDays()} jour(s)

MODÈLE DE TENTE:
${reservationData.selectedTent}

OPTIONS:
- Assurance tous risques: ${insurance ? 'Oui' : 'Non'}
- Annexe: ${annexe ? 'Oui' : 'Non'}
- Barres de toit: ${roofBars ? 'Oui' : 'Non'}

TARIFICATION:
- Location: ${reservationData.pricing.base}€
- Assurance: ${reservationData.pricing.insurance}€
- Annexe: ${reservationData.pricing.annexe}€
- Barres de toit: ${reservationData.pricing.roofBars}€
- Total: ${reservationData.pricing.total}€
- Caution: ${reservationData.pricing.deposit}€

CONTACT:
- Nom: ${formData.name}
- Téléphone: ${formData.phone}
- Email: ${formData.email}

MESSAGE:
${formData.message || 'Aucun message'}
      `;

      // For now, we'll create a mailto link since there's no contact form endpoint
      const mailtoLink = `mailto:info@endless-tents.com?subject=Demande de réservation de tente de toit&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');

      toast({
        title: "Demande de réservation envoyée",
        description: "Votre client email s'est ouvert avec votre demande. Nous vous recontacterons rapidement !",
        variant: "default"
      });

      // Reset form
      setFormData({ name: '', phone: '', email: '', message: '' });
      setStartDate('');
      setEndDate('');
      setSelectedProduct('');
      setInsurance(false);
      setAnnexe(false);
      setRoofBars(false);

    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const tents = products.filter(product => product.category === 'tent');

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = () => {
    const days = calculateDays();
    if (days === 0) return { base: 0, insurance: 0, annexe: 0, roofBars: 0, total: 0, deposit: 0 };
    
    let base = 0;
    
    // Nouvelle grille tarifaire
    if (days >= 2 && days <= 3) {
      // Week-end minimum
      base = 89 + (days > 2 ? (days - 2) * 25 : 0);
    } else if (days >= 4 && days <= 6) {
      // Calcul au jour pour 4-6 jours
      base = 89 + (days - 2) * 25;
    } else if (days === 7) {
      // Semaine fixe
      base = 199;
    } else if (days >= 8 && days <= 13) {
      // Semaine + jours supplémentaires
      base = 199 + (days - 7) * 25;
    } else if (days === 14) {
      // Deux semaines fixe
      base = 349;
    } else if (days >= 15 && days <= 29) {
      // Deux semaines + jours supplémentaires
      base = 349 + (days - 14) * 25;
    } else if (days === 30) {
      // 30 jours
      base = 579;
    } else if (days > 30) {
      // Plus de 30 jours
      base = 579 + (days - 30) * 25;
    } else if (days === 1) {
      // 1 jour seul (cas particulier)
      base = 89;
    }
    
    const insuranceCost = insurance ? days * 8 : 0;
    const annexeCost = annexe ? days * 12 : 0;
    const roofBarsCost = roofBars ? 69 : 0;
    const total = base + insuranceCost + annexeCost + roofBarsCost;
    const deposit = 500;
    
    return { base, insurance: insuranceCost, annexe: annexeCost, roofBars: roofBarsCost, total, deposit };
  };

  const pricing = calculatePrice();
  const days = calculateDays();

  const steps = [
    {
      number: 1,
      title: "Réservation",
      description: "Choisissez vos dates et options en ligne"
    },
    {
      number: 2, 
      title: "Confirmation",
      description: "Nous vous contactons pour confirmer et préparer"
    },
    {
      number: 3,
      title: "Installation",
      description: "Récupération avec tente montée sur votre véhicule"
    },
    {
      number: 4,
      title: "Aventure",
      description: "Partez à l'aventure en toute sérénité"
    }
  ];

  const serviceSchema = generateServiceSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Location', url: '/location' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Location de Tentes de Toit"
        description="Louez une tente de toit STARZZ à partir de 89€/weekend. Service complet avec installation sur votre véhicule. Location déductible à l'achat."
        canonical="/location"
        structuredData={[serviceSchema, breadcrumbSchema]}
      />
      <Header />

      <main className="container mx-auto container-padding py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-display text-primary mb-4">Location de Tentes de Toit</h1>
          <p className="text-large text-muted-foreground max-w-2xl mx-auto">
            Testez nos tentes avant l'achat. Location avec service complet et installation sur votre véhicule.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de réservation */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  Réservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Durée sélectionnée: <span className="font-semibold text-foreground">{days} jour{days > 1 ? 's' : ''}</span>
                    </p>
                  </div>
                )}

                {/* Sélection du modèle */}
                <div>
                  <Label>Modèle de tente (optionnel)</Label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full mt-2 p-2 border border-border rounded-md"
                  >
                    <option value="">Veuillez sélectionner</option>
                    {tents.map(tent => (
                      <option key={tent.id} value={tent.id}>
                        {tent.name} - {tent.specs.sleeping}P - {tent.specs.weightKg}kg
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <Label>Options supplémentaires</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance"
                      checked={insurance}
                      onCheckedChange={(checked) => setInsurance(!!checked)}
                    />
                    <label htmlFor="insurance" className="text-sm flex-1">
                      Assurance tous risques (+8€/jour)
                      <span className="block text-xs text-muted-foreground">
                        Couvre les dommages accidentels
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="annexe"
                      checked={annexe}
                      onCheckedChange={(checked) => setAnnexe(!!checked)}
                    />
                    <label htmlFor="annexe" className="text-sm flex-1">
                      Annexe (+12€/jour)
                      <span className="block text-xs text-muted-foreground">
                        Espace de vie supplémentaire
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roofBars"
                      checked={roofBars}
                      onCheckedChange={(checked) => setRoofBars(!!checked)}
                    />
                    <label htmlFor="roofBars" className="text-sm flex-1">
                      Barres de toit (+69€/location)
                      <span className="block text-xs text-muted-foreground">
                        Location de barres de toit compatibles
                      </span>
                    </label>
                  </div>
                </div>

                {/* Récapitulatif prix */}
                {days > 0 && (
                  <Card className="bg-muted border-border">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-primary mb-3">Récapitulatif</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Location ({days} jour{days > 1 ? 's' : ''})</span>
                          <span>{pricing.base}€</span>
                        </div>
                        {insurance && (
                          <div className="flex justify-between">
                            <span>Assurance</span>
                            <span>{pricing.insurance}€</span>
                          </div>
                        )}
                        {annexe && (
                          <div className="flex justify-between">
                            <span>Annexe</span>
                            <span>{pricing.annexe}€</span>
                          </div>
                        )}
                        {roofBars && (
                          <div className="flex justify-between">
                            <span>Barres de toit</span>
                            <span>{pricing.roofBars}€</span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{pricing.total}€</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Caution</span>
                          <span>{pricing.deposit}€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Informations contact */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input 
                    id="name" 
                    placeholder="Jean Dupont" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input 
                    id="phone" 
                    placeholder="+32 123 45 67 89" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jean@example.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    placeholder="Informations sur votre véhicule, questions particulières..."
                    rows={3}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={!startDate || !endDate || days === 0 || loading}
                  onClick={handleSubmitReservation}
                >
                  {loading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-pulse" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Demander une réservation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informations et processus */}
          <div className="space-y-6">
            {/* Comment ça marche */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex gap-4">
                      <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avantages location */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Nos avantages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Installation comprise</h4>
                      <p className="text-sm text-muted-foreground">
                        Tente montée et réglée sur votre véhicule
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Déduction à l'achat</h4>
                      <p className="text-sm text-muted-foreground">
                        100% du montant déductible si vous achetez
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Support 24/7</h4>
                      <p className="text-sm text-muted-foreground">
                        Assistance téléphonique pendant votre location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Matériel inclus</h4>
                      <p className="text-sm text-muted-foreground">
                        Matelas, échelle, kit de montage fournis
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact direct */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Une question ?
                  </h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Contactez directement notre équipe
                  </p>
                  <div className="flex flex-col gap-2">
                    <a href="tel:+32497228743" className="inline-flex items-center justify-center">
                      <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                        <Phone className="w-4 h-4 mr-2" />
                        +32 497 22 87 43
                      </Button>
                    </a>
                     <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       24/24
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tentes disponibles */}
        <section className="mt-16">
          <h2 className="text-headline text-primary mb-8 text-center">
            Nos tentes disponibles à la location
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {tents.map(tent => (
              <ProductCard key={tent.id} product={tent} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Location;