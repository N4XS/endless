import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Shield, Zap, Heart, Mail, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { SEO, generateFAQSchema } from '@/components/SEO';

const Index = () => {
  const { products, loading } = useProducts();
  
  const benefits = [
    {
      icon: MapPin,
      title: "Liberté totale",
      description: "Votre hébergement vous suit partout. Explorez sans contraintes."
    },
    {
      icon: Heart,
      title: "Confort optimal", 
      description: "Matelas haute densité et ventilation parfaite pour des nuits réparatrices."
    },
    {
      icon: Shield,
      title: "Qualité durable",
      description: "Matériaux résistants aux intempéries, saison après saison."
    },
    {
      icon: Zap,
      title: "60 secondes",
      description: "Installation express pour profiter immédiatement de l'aventure."
    }
  ];

  const faqSchemaData = generateFAQSchema(faqs.slice(0, 5));

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Accueil"
        description="Endless - Vendeur de rêves étoilés. Découvrez STARZZ, notre tente de toit premium. Vente et location en Belgique. Installation gratuite & garantie 1 an."
        canonical="/"
        structuredData={faqSchemaData}
      />
      <Header />
      <main>
        <Hero />

        {/* Intro */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-display text-foreground mb-6">
                Née d'une passion belge
              </h2>
              <p className="text-large text-muted-foreground leading-relaxed">
                ENDLESS est née du rêve d'un aventurier belge : offrir des tentes de toit de qualité supérieure 
                qui transforment votre véhicule en refuge confortable. Pour les explorateurs du week-end 
                comme pour les aventuriers aguerris.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-headline text-foreground mb-4">
                Pourquoi choisir ENDLESS ?
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-all">
                  <benefit.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-display text-foreground mb-2">STARZZ</h2>
                <p className="text-muted-foreground">Notre tente de toit premium</p>
              </div>
              <Link to="/tentes">
                <Button variant="outline" className="group">
                  En savoir plus
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Chargement...
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Location CTA */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-display text-foreground mb-6">
                Testez avant d'acheter
              </h2>
              <p className="text-large text-muted-foreground mb-10">
                Louez une tente pour votre aventure. Si elle vous plaît, 
                déduisez le montant de la location de votre achat.
              </p>
              
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-display font-semibold text-foreground">89€</div>
                    <div className="text-sm text-muted-foreground">Weekend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display font-semibold text-foreground">199€</div>
                    <div className="text-sm text-muted-foreground">Semaine</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-display font-semibold text-secondary">100%</div>
                    <div className="text-sm text-muted-foreground">Déductible</div>
                  </div>
                </div>

                <Link to="/location">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Réserver une location
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-display text-foreground mb-4">
                  Questions fréquentes
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.slice(0, 5).map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="text-center mt-8">
                <Link to="/faq">
                  <Button variant="outline" className="group">
                    Voir toutes les FAQ
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-display mb-4">Besoin d'un conseil ?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Notre équipe vous accompagne pour planifier votre aventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Nous contacter
                </Button>
              </Link>
              <a href="tel:+32497228743">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Phone className="w-4 h-4 mr-2" />
                  +32 497 22 87 43
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
