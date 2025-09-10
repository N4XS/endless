import { Link } from 'react-router-dom';
import { Star, Clock, Shield, Truck, ArrowRight, MapPin, Zap, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { products, testimonials, faqs } from '@/data/products';

const Index = () => {
  const benefits = [
    {
      icon: MapPin,
      title: "Liberté sans compromis",
      description: "Partez quand vous voulez, où vous voulez. Avec une tente de toit Endless, votre hébergement vous suit partout, vous offrant une liberté totale pour explorer sans contraintes."
    },
    {
      icon: Heart,
      title: "Confort exceptionnel", 
      description: "Nos tentes sont conçues pour offrir un confort optimal, avec des matelas haute densité, une excellente isolation et une ventilation parfaite pour des nuits réparatrices sous les étoiles."
    },
    {
      icon: Shield,
      title: "Qualité supérieure",
      description: "Chaque tente Endless est fabriquée avec des matériaux durables et résistants aux intempéries, conçus pour vous accompagner dans toutes vos aventures, saison après saison."
    },
    {
      icon: Zap,
      title: "Installation rapide",
      description: "En moins de 3 minutes, déployez votre espace de vie et profitez pleinement de l'apéro face au coucher de soleil."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Section intro */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <p className="text-large text-muted-foreground leading-relaxed">
                <strong>ENDLESS</strong> est né de la passion d'un belge qui rêvait d'une liberté sans limites. 
                Notre mission est simple : vous offrir des tentes de toit de qualité supérieure qui transforment votre véhicule en un refuge confortable, où que vous soyez. 
                Que vous soyez un aventurier aguerri ou un explorateur du week-end, nos merveilles s'adaptent à votre véhicule et vous permettent de vivre des expériences authentiques, en harmonie avec la nature.
              </p>
            </div>
          </div>
        </section>

        {/* Bénéfices */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-display text-primary mb-4">
                Pourquoi choisir ENDLESS ?
              </h2>
              <p className="text-large text-muted-foreground max-w-2xl mx-auto">
                L'expertise belge au service de votre aventure
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card-feature group">
                  <h3 className="text-title text-primary mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nos Tentes */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-display text-primary mb-4">Starzz</h2>
                <p className="text-large text-muted-foreground">
                  Chaque aventure mérite son équipement
                </p>
              </div>
              <Link to="/tentes">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Voir toute la gamme
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Service location barres de toit */}
            <div className="mt-16 p-8 bg-gradient-nature rounded-2xl border border-border">
              <div className="text-center">
                <h3 className="text-headline text-primary mb-4">
                  Location de barres de toit
                </h3>
                <p className="text-large text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Pas encore de barres de toit ? Nous proposons également la location de barres de toit compatibles pour votre véhicule.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/location">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Découvrir nos locations
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Nous contacter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Week-end */}
        <section className="section-padding bg-gradient-nature">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-display text-primary mb-6">
                Testez avant d'acheter
              </h2>
              <p className="text-large text-muted-foreground mb-8 max-w-2xl mx-auto">
                Louez une tente de toit pour un week-end et découvrez le plaisir du camping en altitude. 
                Si elle vous plaît, déduisez le montant de la location de votre achat !
              </p>
              
              <div className="bg-card border border-border rounded-lg p-8 shadow-card">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">89€</div>
                    <div className="text-muted-foreground">Weekend (2 nuits)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">149€</div>
                    <div className="text-muted-foreground">Semaine (7 nuits)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <div className="text-muted-foreground">Déductible à l'achat</div>
                  </div>
                </div>

                <Link to="/location">
                  <Button size="lg" className="bg-olive hover:bg-olive/90 text-secondary-foreground">
                    Réserver une location
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-primary mb-4">
                  Questions Fréquentes
                </h2>
                <p className="text-large text-muted-foreground">
                  Toutes les réponses à vos questions sur les tentes de toit
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="bg-card border border-border rounded-lg px-6 shadow-soft"
                  >
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Besoin d'un conseil */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-display mb-4">Besoin d'un conseil ?</h2>
            <p className="text-large mb-8 opacity-90 max-w-2xl mx-auto">
              Notre équipe d'experts vous aide à choisir la tente parfaite pour votre véhicule et vos aventures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90">
                  <MapPin className="w-5 h-5 mr-2" />
                  Nous contacter
                </Button>
              </Link>
              <a href="tel:+32497228743">
                <Button size="lg" variant="outline" className="border-os text-os hover:bg-os hover:text-primary">
                  Appeler maintenant
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
