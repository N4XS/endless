import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Users, 
  Weight, 
  Ruler, 
  Shield, 
  Zap, 
  Clock,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle
} from 'lucide-react';
import { products } from '@/data/products';
import tentImage from '@/assets/product-hardshell-tent.jpg';

const Tentes = () => {
  // Récupère uniquement la tente STARZZ
  const starzz = products.find(product => product.name === 'STARZZ');

  if (!starzz) {
    return <div>Produit non trouvé</div>;
  }

  const highlights = [
    {
      icon: Users,
      label: 'Capacité',
      value: `${starzz.specs.sleeping} personnes`
    },
    {
      icon: Weight,
      label: 'Poids',
      value: `${starzz.specs.weightKg} kg`
    },
    {
      icon: Ruler,
      label: 'Dimensions',
      value: starzz.specs.openSize
    },
    {
      icon: Shield,
      label: 'Type',
      value: starzz.specs.shell === 'hard' ? 'Hard-shell' : 'Soft-shell'
    }
  ];

  const advantages = [
    {
      icon: Zap,
      title: 'Installation Express',
      description: 'Déployée en moins de 3 minutes grâce à son système innovant'
    },
    {
      icon: Shield,
      title: 'Robustesse Premium',
      description: 'Matériaux haute qualité résistants aux intempéries'
    },
    {
      icon: Clock,
      title: 'Durabilité',
      description: 'Conçue pour vous accompagner saison après saison'
    },
    {
      icon: CheckCircle,
      title: 'Garantie Sérénité',
      description: '30 jours satisfait ou remboursé + installation comprise'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section Produit */}
        <section className="bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
              <div>
                <Badge className="bg-olive text-secondary-foreground mb-4">
                  Tente Premium
                </Badge>
                <h1 className="text-hero mb-6">
                  STARZZ
                </h1>
                <p className="text-large mb-8 opacity-90 leading-relaxed">
                  La tente de toit STARZZ a été pensée dans les moindres détails pour rendre le voyage simple et agréable. 
                  Elle allie compacité et confort pour vos escapades en couple ou entre amis.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl font-bold mb-1">{starzz.price}€</div>
                    <div className="text-sm opacity-75">TTC, installation comprise</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90">
                      Commander maintenant
                    </Button>
                    <Link to="/location">
                      <Button size="lg" variant="outline" className="border-os text-os hover:bg-os hover:text-primary">
                        Louer d'abord
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Livraison 3-5 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>En stock</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg shadow-hero">
                  <img 
                    src={starzz.images[0]} 
                    alt="Tente STARZZ" 
                    className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Badges flottants */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-olive text-secondary-foreground">
                    ⭐ Bestseller
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-ambre text-accent-foreground">
                    Installation comprise
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Caractéristiques clés */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {highlights.map((highlight, index) => (
                <Card key={index} className="text-center shadow-card hover:shadow-hero transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-sunset rounded-lg flex items-center justify-center mx-auto mb-4">
                      <highlight.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-primary mb-1">{highlight.value}</div>
                    <div className="text-sm text-muted-foreground">{highlight.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Galerie d'images */}
            <div className="grid md:grid-cols-3 gap-4 mb-16">
              {starzz.images.slice(1, 4).map((image, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg shadow-card hover:shadow-hero transition-shadow group">
                  <img 
                    src={image} 
                    alt={`STARZZ vue ${index + 2}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Description détaillée */}
        <section className="section-padding bg-os/50">
          <div className="container mx-auto container-padding">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-display text-primary mb-8 text-center">
                Pourquoi choisir la STARZZ ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {advantages.map((advantage, index) => (
                  <Card key={index} className="shadow-card hover:shadow-hero transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                          <advantage.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-lg">{advantage.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{advantage.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Description technique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {starzz.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Caractéristiques principales</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {starzz.features.slice(0, 6).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Équipements inclus</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {starzz.features.slice(6).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="section-padding bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-display mb-6">Prêt pour l'aventure ?</h2>
            <p className="text-large mb-8 opacity-90 max-w-2xl mx-auto">
              Rejoignez des milliers d'aventuriers qui ont fait confiance à ENDLESS pour leurs escapades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90">
                Commander maintenant - {starzz.price}€
              </Button>
              <Link to="/location">
                <Button size="lg" variant="outline" className="border-os text-os hover:bg-os hover:text-primary">
                  Tester en location
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+32 497 22 87 43</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@endless-tents.be</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Showroom en Belgique</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tentes;