import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Wrench, Truck, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion outdoor",
      description: "Nous partageons votre passion pour l'aventure et la découverte de nouveaux horizons."
    },
    {
      icon: Award,
      title: "Qualité premium",
      description: "Nous sélectionnons uniquement les meilleures marques pour vous garantir fiabilité et durabilité."
    },
    {
      icon: Users,
      title: "Service personnalisé",
      description: "Chaque client est unique. Nous vous accompagnons dans le choix de votre équipement."
    },
    {
      icon: Wrench,
      title: "Expertise technique", 
      description: "Notre équipe maîtrise parfaitement l'installation et la maintenance des tentes de toit."
    }
  ];

  const team = [
    {
      name: "Pierre Dubois",
      role: "Fondateur & Expert technique",
      bio: "15 ans d'expérience dans l'outdoor, passionné de road-trips en famille."
    },
    {
      name: "Sophie Martin",
      role: "Responsable location",
      bio: "Spécialiste de l'accompagnement client, elle vous aide à choisir la tente parfaite."
    },
    {
      name: "Marc Janssen",
      role: "Technicien installation",
      bio: "Expert en montage et réparation, il assure la qualité de nos installations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero À propos */}
        <section className="section-padding bg-gradient-nature">
          <div className="container mx-auto container-padding text-center">
            <h1 className="text-display text-sapin mb-6">
              L'aventure belge depuis 2018
            </h1>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Créée par des passionnés pour des passionnés, RoofTent Pro est née de l'envie 
              de démocratiser les voyages en tente de toit en Belgique. Nous croyons que 
              l'aventure doit être accessible, confortable et sûre.
            </p>
          </div>
        </section>

        {/* Notre histoire */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-headline text-sapin mb-6">Notre histoire</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Tout a commencé en 2018 avec Pierre, un passionné de road-trips qui 
                    cherchait la tente de toit parfaite pour ses aventures familiales 
                    dans les Ardennes. Frustré par le manque d'options en Belgique, 
                    il décide de créer sa propre entreprise.
                  </p>
                  <p>
                    Aujourd'hui, RoofTent Pro est devenue la référence belge de la 
                    tente de toit premium. Nous avons équipé plus de 500 familles 
                    et continuons à grandir grâce à votre confiance.
                  </p>
                  <p>
                    Notre showroom de Bruxelles accueille les curieux et les 
                    aventuriers confirmés dans une ambiance conviviale et professionnelle. 
                    Parce que choisir sa tente de toit, c'est avant tout une affaire humaine.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-sunset p-8 rounded-lg">
                <div className="grid grid-cols-2 gap-6 text-center text-charbon">
                  <div>
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm font-medium">Clients équipés</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">6</div>
                    <div className="text-sm font-medium">Années d'expérience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">15+</div>
                    <div className="text-sm font-medium">Marques partenaires</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">98%</div>
                    <div className="text-sm font-medium">Clients satisfaits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-headline text-sapin mb-4">Nos valeurs</h2>
              <p className="text-large text-muted-foreground">
                Ce qui nous anime au quotidien
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="shadow-card text-center hover:shadow-hero transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-sapin mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Notre équipe */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-headline text-sapin mb-4">Notre équipe</h2>
              <p className="text-large text-muted-foreground">
                Des passionnés à votre service
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="shadow-card text-center">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-primary-foreground font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sapin mb-1">{member.name}</h3>
                    <p className="text-sm text-ambre font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Showroom */}
        <section className="section-padding bg-charbon text-os">
          <div className="container mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-headline text-ambre mb-6">
                  Visitez notre showroom
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Notre showroom de 400m² vous permet de découvrir toute notre gamme 
                    en conditions réelles. Toutes nos tentes sont montées et vous pouvez 
                    les tester avant de faire votre choix.
                  </p>
                  <p>
                    Situé à Bruxelles avec un accès facile et un parking gratuit, 
                    notre espace vous accueille dans une ambiance chaleureuse. 
                    Café offert et conseils personnalisés garantis !
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 my-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-ambre flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Rue de l'Aventure 42</div>
                      <div className="text-sm text-os/80">1000 Bruxelles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-ambre flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Parking gratuit</div>
                      <div className="text-sm text-os/80">20 places disponibles</div>
                    </div>
                  </div>
                </div>

                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="bg-ambre text-charbon hover:bg-ambre/90">
                    Planifier une visite
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <div className="bg-os/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-ambre mb-3">Horaires d'ouverture</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lundi - Vendredi</span>
                      <span>9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samedi</span>
                      <span>9h00 - 17h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche</span>
                      <span>Sur rendez-vous</span>
                    </div>
                  </div>
                </div>

                <div className="bg-os/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-ambre mb-3">Services disponibles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-ambre rounded-full"></div>
                      <span>Test de toutes les tentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-ambre rounded-full"></div>
                      <span>Installation sur place</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-ambre rounded-full"></div>
                      <span>Formation au montage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-ambre rounded-full"></div>
                      <span>Service après-vente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="section-padding bg-gradient-nature">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-headline text-sapin mb-6">
              Prêt pour votre prochaine aventure ?
            </h2>
            <p className="text-large text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez notre gamme complète ou testez une tente en location. 
              L'aventure commence ici.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tentes">
                <Button size="lg" className="bg-sapin hover:bg-sapin/90">
                  Découvrir nos tentes
                </Button>
              </Link>
              <Link to="/location">
                <Button size="lg" variant="outline" className="border-olive text-olive">
                  Essayer en location
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;