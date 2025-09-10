import { useState } from 'react';
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
  CheckCircle,
  ZoomIn
} from 'lucide-react';
import { products } from '@/data/products';
import tentImage from '@/assets/product-hardshell-tent.jpg';

const Tentes = () => {
  // Récupère uniquement la tente STARZZ
  const starzz = products.find(product => product.name === 'STARZZ');
  const [selectedImage, setSelectedImage] = useState(0);

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
      value: 'Premium'
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
        {/* Hero Section avec background image */}
        <section 
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${starzz.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-charbon/80 via-charbon/40 to-transparent"></div>
          
          <div className="relative z-10 container mx-auto container-padding text-center md:text-left">
            <div className="max-w-2xl">
              <Badge className="bg-olive text-secondary-foreground mb-4">
                Tente Premium
              </Badge>
              <h1 className="text-hero font-display text-background mb-6 leading-tight">
                STARZZ
              </h1>
              <p className="text-large text-background/90 mb-8 max-w-xl leading-relaxed">
                La tente de toit STARZZ a été pensée dans les moindres détails pour rendre le voyage simple et agréable. 
                Elle allie compacité et confort pour vos escapades en couple ou entre amis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold text-background mb-1">{starzz.price}€</div>
                  <div className="text-sm text-background/75">TTC, installation comprise</div>
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

              <div className="flex items-center gap-6 text-sm text-background/90">
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
          </div>
        </section>

        {/* Section Carrousel d'images */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Miniatures */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
                    {starzz.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-primary shadow-hero' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`STARZZ vue ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Image principale */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-hero group">
                    <img
                      src={starzz.images[selectedImage]}
                      alt="Tente de toit STARZZ"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-3 bg-background/95 backdrop-blur rounded-full shadow-soft">
                        <ZoomIn className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informations produit */}
                <div className="lg:col-span-3 order-3">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">STARZZ</CardTitle>
                      <p className="text-sm text-muted-foreground">TTC, frais de port non compris</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-4xl font-bold text-primary">{starzz.price}€</div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-muted-foreground">En stock</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Livraison sous 3-5 jours ouvrables</span>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Garantie :</span>
                          <span>Satisfait ou remboursé 30 jours</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expédition :</span>
                          <span>3-5 jours ouvrables</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Conditions :</span>
                          <Link to="/cgv" className="text-primary hover:underline">CGV</Link>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Ajouter au panier
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Caractéristiques clés */}
        <section className="section-padding bg-os/50">
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
          </div>
        </section>

        {/* Description détaillée */}
        <section className="section-padding">
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
              Rejoignez les aventuriers qui ont fait confiance à ENDLESS pour leurs escapades.
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tentes;