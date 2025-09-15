import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { fadeUp, staggerContainer } from '@/lib/motion';

export const Hero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-4 md:pt-0 pb-6 md:pb-0">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Aventure en tente de toit dans les Ardennes belges"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charbon/60 via-charbon/30 to-transparent"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto container-padding text-center md:text-left">
        <ScrollReveal variants={staggerContainer}>
          <div className="max-w-2xl">
          {/* Badge */}
          <ScrollReveal variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 mt-4 md:mt-0 border border-background/30">
              <div className="w-2 h-2 bg-ambre rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-background">
                Marque belge • Garantie 2 ans • Livraison en 48H
              </span>
            </div>
          </ScrollReveal>

          {/* Titre principal */}
          <ScrollReveal variants={fadeUp}>
            <h1 className="text-hero font-display text-background mb-6 leading-tight">
              Explorez le monde avec 
              <span className="text-ambre block md:inline md:ml-3">
                style et confort
              </span>
            </h1>
          </ScrollReveal>

          {/* Sous-titre */}
          <ScrollReveal variants={fadeUp}>
            <p className="text-large text-background/90 mb-8 max-w-xl leading-relaxed">
              Découvrez notre tente Starzz. Pour les aventuriers qui ne veulent pas choisir entre confort et liberté.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal variants={fadeUp}>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/tentes">
                <Button size="lg" className="bg-sapin hover:bg-sapin/90 text-primary-foreground shadow-hero group">
                  Acheter une tente
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/location">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20 hover:text-background"
                >
                  Louer pour votre aventure
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          </div>
        </ScrollReveal>
      </div>

    </section>
  );
};