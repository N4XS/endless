import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageCarousel } from '@/components/ImageCarousel';
import { ProductInfoCard } from '@/components/ProductInfoCard';
import { LazyImage } from '@/components/LazyImage';
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
        {/* Hero Section avec background image optimisé Safari */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <LazyImage
              src="/images/ST1.jpg"
              alt="STARZZ - Tente de toit premium en action"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-charbon/80 via-charbon/40 to-transparent" />
          
          <div className="relative z-10 container mx-auto container-padding text-center md:text-left">
            <div className="max-w-2xl">
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
                      Louer pour mon aventure
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Carrousel d'images */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-7xl mx-auto">
              <ImageCarousel 
                images={starzz.images} 
                productName="STARZZ" 
                className="mb-8"
              />
              
              {/* Product Info Card - Now using secure React component */}
              <div className="mt-8">
                <ProductInfoCard 
                  product={starzz}
                  onAddToCart={handleAddToCart}
                />
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