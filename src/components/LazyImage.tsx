import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

// Détection Safari pour optimisations spécifiques
const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Support du lazy loading natif
const supportsLazyLoading = typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;

export const LazyImage = ({ src, alt, className, width, height }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!supportsLazyLoading || isSafari);

  useEffect(() => {
    // Pour Safari, on évite le lazy loading natif qui peut poser problème
    if (isSafari && !shouldLoad) {
      const timer = setTimeout(() => setShouldLoad(true), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  // Utilisation d'une image normale pour Safari avec optimisations
  if (isSafari || !supportsLazyLoading) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {!isLoaded && !isError && (
          <div className="absolute inset-0 bg-muted/50 pointer-events-none" 
               aria-hidden="true"
               style={{
                 background: 'linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted)/0.5) 50%, hsl(var(--muted)) 75%)',
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 1.5s infinite'
               }} 
          />
        )}
        <img
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            // Optimisations Safari
            imageRendering: 'auto',
            backfaceVisibility: 'hidden',
            //@ts-ignore - WebKit propriétés pour Safari
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
        {isError && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image non disponible</span>
          </div>
        )}
      </div>
    );
  }

  // Version normale pour les autres navigateurs
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <motion.img
        key={src}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {isError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};