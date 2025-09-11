import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { CarouselSnap } from '@/components/CarouselSnap';
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
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';


const Tentes = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Get the STARZZ product from Supabase
  const starzz = products.find(product => product.name === 'STARZZ') || products[0];

  // Images pour le carousel avec variantes optimisées
  const carouselImages = [
    { 
      src: "/images/ST1.jpg", 
      alt: "Tente STARZZ vue extérieure complète",
      title: "Vue d'ensemble",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST2.jpg", 
      alt: "Tente STARZZ détail montage",
      title: "Système de montage",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST3.jpg", 
      alt: "Tente STARZZ intérieur spacieux",
      title: "Espace intérieur",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST4.jpg", 
      alt: "Tente STARZZ résistance vent",
      title: "Résistance au vent",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST5.jpg", 
      alt: "Tente STARZZ étanchéité pluie",
      title: "Protection pluie",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST6.jpg", 
      alt: "Tente STARZZ aération optimale",
      title: "Système d'aération",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST7.jpg", 
      alt: "Tente STARZZ rangement compact",
      title: "Rangement facile",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST8.jpg", 
      alt: "Tente STARZZ accessoires inclus",
      title: "Accessoires",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST9.jpg", 
      alt: "Tente STARZZ utilisation terrain",
      title: "Sur le terrain",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST10.jpg", 
      alt: "Tente STARZZ qualité matériaux",
      title: "Matériaux premium",
      width: 1280,
      height: 720
    },
    { 
      src: "/images/ST-camp.jpg", 
      alt: "Tente STARZZ camping sauvage",
      title: "Camping sauvage",
      width: 1280,
      height: 720
    }
  ];

  // Add event listener for the embedded button
  useEffect(() => {
    const handleAddToCartEvent = () => {
      handleAddToCart();
    };

    window.addEventListener('addToCart', handleAddToCartEvent);
    return () => window.removeEventListener('addToCart', handleAddToCartEvent);
  }, [starzz]);

  const handleAddToCart = () => {
    if (starzz) {
      addToCart(starzz);
      toast({
        title: "Produit ajouté au panier",
        description: `${starzz.name} a été ajouté à votre panier.`
      });
    }
  };

  const handleBuyNow = () => {
    if (starzz) {
      addToCart(starzz);
      // Navigate to checkout will be handled by the Link
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center">
              <div className="text-display text-primary">Chargement...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!starzz) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center">
              <div className="text-display text-primary">Produit non trouvé</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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
      label: 'Express',
      value: '60 secondes'
    }
  ];

  const advantages = [
    {
      icon: Zap,
      title: 'Installation Express',
      description: 'La tente se déploie en 60sec grâce à son système innovant'
    },
    {
      icon: Shield,
      title: 'Robustesse',
      description: 'Matériaux durables résistants aux intempéries'
    },
    {
      icon: Clock,
      title: 'Durabilité',
      description: 'Conçue pour vous accompagner saison après saison'
    },
    {
      icon: CheckCircle,
      title: 'Garantie & Sérénité',
      description: '30 jours satisfait ou remboursé + installation comprise'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section avec image responsive */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <ResponsiveImage 
            src="/images/ST1.jpg"
            alt="Tente de toit STARZZ - Installation express en 60 secondes"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
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
                  <Link to="/checkout">
                    <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90" onClick={handleBuyNow}>
                      Commander maintenant
                    </Button>
                  </Link>
                  <Link to="/location">
                    <Button size="lg" variant="outline" className="border-os text-primary hover:bg-os hover:text-primary">
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

        {/* Section Carousel d'images */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Galerie Photos
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Découvrez la STARZZ en images
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Une sélection de photos pour vous montrer tous les détails de notre tente premium
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <CarouselSnap 
                items={carouselImages}
                peek="5vw"
                gap={24}
                aspectRatio="16/10"
                showDots={true}
                className="mb-8"
              />
              
              {/* Informations produit sous le carousel */}
              <div className="bg-card rounded-xl shadow-card border border-border p-6 max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">STARZZ</h2>
                    <p className="text-sm text-muted-foreground">TTC, frais de port non compris</p>
                  </div>
                  
                  <div className="text-4xl font-bold text-primary">{starzz.price}€</div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-muted-foreground">En stock</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Livraison sous 3-5 jours ouvrables</span>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Garantie :</span>
                      <span className="text-right">Satisfait ou remboursé 30 jours</span>
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
                  
                  <Button 
                    className="w-full touch-target" 
                    onClick={handleAddToCart}
                    size="lg"
                  >
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Caractéristiques clés */}
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

        {/* Description détaillée */}
        <section className="py-8">
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
              <Link to="/checkout">
                <Button size="lg" variant="secondary" className="bg-os text-primary hover:bg-os/90" onClick={handleBuyNow}>
                  Commander maintenant - {starzz.price}€
                </Button>
              </Link>
              <Link to="/location">
                <Button size="lg" variant="outline" className="border-os text-primary hover:bg-os hover:text-primary">
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

export default Tentes;