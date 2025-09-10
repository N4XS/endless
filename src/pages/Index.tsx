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
      icon: Zap,
      title: "Montage Ultra-Rapide",
      description: "De 2 à 5 minutes selon le modèle. Hard-shell automatique, soft-shell simple et efficace."
    },
    {
      icon: Heart,
      title: "Confort Premium", 
      description: "Matelas haute densité inclus, toiles respirantes, finitions soignées pour un vrai lit."
    },
    {
      icon: Shield,
      title: "Service Belge",
      description: "Équipe locale, showroom à Bruxelles, SAV réactif, garantie 3 ans sur toute la gamme."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Bénéfices */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-display text-sapin mb-4">
                Pourquoi choisir RoofTent Pro ?
              </h2>
              <p className="text-large text-muted-foreground max-w-2xl mx-auto">
                L'expertise belge au service de votre aventure
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card-feature group">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-title text-sapin mb-3">{benefit.title}</h3>
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
                <h2 className="text-display text-sapin mb-4">Nos Tentes de Toit</h2>
                <p className="text-large text-muted-foreground">
                  Chaque aventure mérite son équipement
                </p>
              </div>
              <Link to="/tentes">
                <Button variant="outline" className="border-sapin text-sapin hover:bg-sapin hover:text-primary-foreground">
                  Voir toute la gamme
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Location Week-end */}
        <section className="section-padding bg-gradient-nature">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-display text-sapin mb-6">
                Testez avant d'acheter
              </h2>
              <p className="text-large text-muted-foreground mb-8 max-w-2xl mx-auto">
                Louez une tente de toit pour un week-end et découvrez le plaisir du camping en altitude. 
                Si elle vous plaît, déduisez le montant de la location de votre achat !
              </p>
              
              <div className="bg-card border border-border rounded-lg p-8 shadow-card">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sapin mb-2">89€</div>
                    <div className="text-muted-foreground">Weekend (2 nuits)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sapin mb-2">149€</div>
                    <div className="text-muted-foreground">Semaine (7 nuits)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sapin mb-2">100%</div>
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

        {/* Témoignages */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-display text-sapin mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-large text-muted-foreground">
                L'avis de nos clients aventuriers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="shadow-card hover:shadow-hero transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {testimonial.location}
                        </p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-ambre text-ambre" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">
                      "{testimonial.comment}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-sapin mb-4">
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
                    <AccordionTrigger className="text-left font-semibold text-sapin hover:text-sapin/80">
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
                <Button size="lg" variant="secondary" className="bg-os text-sapin hover:bg-os/90">
                  <MapPin className="w-5 h-5 mr-2" />
                  Visiter le showroom
                </Button>
              </Link>
              <a href="tel:+3221234567">
                <Button size="lg" variant="outline" className="border-os text-os hover:bg-os hover:text-sapin">
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
