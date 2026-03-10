import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { SwiperCarousel } from '@/components/SwiperCarousel';
import { ProductInfoCard } from '@/components/ProductInfoCard';
import { LazyImage } from '@/components/LazyImage';
import { PreorderDialog } from '@/components/PreorderDialog';
import { SEO, generateProductSchema, generateBreadcrumbSchema } from '@/components/SEO';
import { 
  Users, 
  Weight, 
  Ruler, 
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Tentes = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const starzz = products.find(product => product.name === 'STARZZ') || products[0];

  const handleAddToCart = () => {
    if (starzz) {
      addToCart(starzz);
      toast({
        title: "Ajouté au panier",
        description: `${starzz.name} a été ajouté à votre panier.`
      });
    }
  };

  const handleBuyNow = () => {
    if (starzz) {
      addToCart(starzz);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto container-padding text-center">
            <div className="text-muted-foreground">Chargement...</div>
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
          <div className="container mx-auto container-padding text-center">
            <div className="text-foreground">Produit non trouvé</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const highlights = [
    { icon: Users, label: 'Capacité', value: '2-3 personnes' },
    { icon: Weight, label: 'Poids', value: `${starzz.specs.weightKg} kg` },
    { icon: Ruler, label: 'Dimensions', value: starzz.specs.openSize },
    { icon: Clock, label: 'Installation', value: '60 secondes' }
  ];

  const advantages = [
    {
      icon: Zap,
      title: 'Installation Express',
      description: 'Déploiement en 60 secondes grâce au système innovant'
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
      title: 'Garantie 1 an',
      description: 'Garantie constructeur + installation comprise'
    }
  ];

  const productSchema = generateProductSchema({
    name: 'STARZZ - Tente de Toit Premium',
    description: starzz.description,
    price: starzz.price,
    image: 'https://endless-tents.com/images/ST1.jpg',
    sku: 'STARZZ-001',
    availability: starzz.stock > 0 ? 'InStock' : 'PreOrder',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Tentes de Toit', url: '/tentes' },
  ]);

  const combinedSchema = [productSchema, breadcrumbSchema];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="STARZZ - Tente de Toit Premium"
        description={`Découvrez STARZZ, notre tente de toit premium à ${starzz.price}€. Installation en 60 secondes, capacité 2-3 personnes. Livraison en Belgique et international.`}
        canonical="/tentes"
        type="product"
        structuredData={combinedSchema}
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <LazyImage
              src="/images/ST1.jpg"
              alt="STARZZ - Tente de toit premium"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          <div className="relative z-10 container mx-auto container-padding">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-sm text-white/80 font-medium mb-4">
                <span className="w-8 h-px bg-secondary" />
                Tente de toit premium
              </span>
              
              <h1 className="text-hero text-white mb-4">STARZZ</h1>
              
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Pensée dans les moindres détails pour rendre le voyage simple et agréable. 
                Compacité et confort pour vos escapades.
              </p>
              
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-display font-semibold text-white">{starzz.price}€</span>
                <span className="text-white/60">TTC, installation comprise</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {starzz.stock > 0 ? (
                  <Link to="/checkout">
                    <Button 
                      size="lg" 
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                      onClick={handleBuyNow}
                    >
                      Commander maintenant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <PreorderDialog product={starzz}>
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Précommander
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </PreorderDialog>
                )}
                <Link to="/location">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  >
                    Essayer en location
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <SwiperCarousel 
              images={starzz.images} 
              productName="STARZZ" 
              className="mb-8"
            />
            
            <div className="mt-8">
              <ProductInfoCard 
                product={starzz}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="py-12">
          <div className="container mx-auto container-padding">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-5 text-center">
                  <highlight.icon className="w-6 h-6 mx-auto mb-3 text-primary" />
                  <div className="font-semibold text-foreground mb-1">{highlight.value}</div>
                  <div className="text-sm text-muted-foreground">{highlight.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto container-padding">
            <h2 className="text-display text-foreground text-center mb-12">
              Pourquoi choisir STARZZ ?
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {advantages.map((advantage, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <advantage.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-display text-foreground text-center mb-4">
                Description technique
              </h2>
              <p className="text-center text-muted-foreground mb-10">
                {starzz.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Caractéristiques
                  </h3>
                  <ul className="space-y-3">
                    {starzz.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Équipements inclus
                  </h3>
                  <ul className="space-y-3">
                    {starzz.features.slice(6).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto container-padding text-center">
            <h2 className="text-display mb-4">Prêt pour l'aventure ?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Rejoignez les aventuriers qui ont fait confiance à ENDLESS.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              {starzz.stock > 0 ? (
                <Link to="/checkout">
                  <Button 
                    size="lg" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                    onClick={handleBuyNow}
                  >
                    Commander - {starzz.price}€
                  </Button>
                </Link>
              ) : (
                <PreorderDialog product={starzz}>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Précommander - {starzz.price}€
                  </Button>
                </PreorderDialog>
              )}
              <Link to="/location">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Tester en location
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-primary-foreground/70">
              <a href="tel:+32497228743" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +32 497 22 87 43
              </a>
              <a href="mailto:info@endless-tents.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                info@endless-tents.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tentes;
