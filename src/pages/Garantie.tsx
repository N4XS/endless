import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Garantie = () => {
  const guaranteeFeatures = [
    {
      icon: Shield,
      title: "Garantie fabricant 1 an",
      description: "Tous nos produits sont couverts par une garantie fabricant de 1 an contre les défauts de fabrication."
    },
    {
      icon: CheckCircle,
      title: "Service après-vente réactif",
      description: "Notre équipe belge vous accompagne pour toute question ou problème technique."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="section-padding bg-gradient-nature">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-hero font-display text-primary mb-6">
                Notre Garantie
              </h1>
              <p className="text-large text-muted-foreground max-w-2xl mx-auto">
                Chez ENDLESS, votre satisfaction est notre priorité. Découvrez nos engagements qualité et nos garanties.
              </p>
            </div>
          </div>
        </section>

        {/* Garanties principales */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {guaranteeFeatures.map((feature, index) => (
                <Card key={index} className="text-center shadow-card hover:shadow-hero transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-sunset rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Détails de la garantie */}
        <section className="pb-16">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Conditions de garantie détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-3">Garantie fabricant (1 an)</h3>
                    <p className="text-muted-foreground mb-4">
                      Nos tentes de toit STARZZ sont couvertes par une garantie fabricant de 1 an à compter de la date d'achat. 
                      Cette garantie couvre :
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Les défauts de fabrication des matériaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Les problèmes de mécanisme d'ouverture/fermeture</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Les défauts d'étanchéité non liés à l'usure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Les défauts de couture et de finition</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-3">Exclusions</h3>
                    <p className="text-muted-foreground mb-2">La garantie ne couvre pas :</p>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                      <li>• L'usure normale liée à l'utilisation</li>
                      <li>• Les dommages causés par une mauvaise utilisation</li>
                      <li>• Les dommages causés par des conditions météorologiques extrêmes</li>
                      <li>• Les modifications ou réparations effectuées par un tiers</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Service client */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-display mb-6">Besoin d'aide ?</h2>
            <p className="text-large mb-8 opacity-90 max-w-2xl mx-auto">
              Notre équipe de service client belge est là pour vous accompagner dans vos démarches de garantie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90">
                  <Mail className="w-5 h-5 mr-2" />
                  Nous contacter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+32497228743">
                <Button size="lg" variant="outline" className="border-os text-primary hover:bg-os hover:text-primary">
                  <Phone className="w-5 h-5 mr-2" />
                  Appeler directement
                </Button>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+32 497 22 87 43</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@endless-tents.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Garantie;