import { useState } from 'react';
import { cn } from '@/lib/utils';
import { detectBrowser } from '@/utils/browser';

interface SafariCompatibleImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const SafariCompatibleImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height,
  loading = 'lazy',
  fetchPriority = 'auto'
}: SafariCompatibleImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isSafari } = detectBrowser();

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setIsError(true);
    console.warn('Image loading failed:', src);
  };

  // Générer les variants d'image (AVIF, WebP, JPG)
  const getImageVariants = (imageSrc: string) => {
    const basePath = imageSrc.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    return {
      avif: `${basePath}.avif`,
      webp: `${basePath}.webp`, 
      jpg: imageSrc.endsWith('.jpg') || imageSrc.endsWith('.jpeg') ? imageSrc : `${basePath}.jpg`
    };
  };

  const variants = getImageVariants(src);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div 
          className="absolute inset-0 bg-muted/50 pointer-events-none animate-pulse"
          aria-hidden="true"
          style={{
            background: isSafari 
              ? 'hsl(var(--muted))' 
              : 'linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted)/0.5) 50%, hsl(var(--muted)) 75%)',
            backgroundSize: isSafari ? 'auto' : '200% 100%',
            animation: isSafari ? 'pulse 2s infinite' : 'shimmer 1.5s infinite'
          }}
        />
      )}

      {/* Picture element avec fallbacks pour Safari */}
      <picture>
        {/* Format moderne AVIF (si supporté) */}
        <source 
          type="image/avif" 
          srcSet={variants.avif}
          media="(min-width: 1px)"
        />
        
        {/* Format WebP (largement supporté) */}
        <source 
          type="image/webp" 
          srcSet={variants.webp}
          media="(min-width: 1px)"
        />
        
        {/* Fallback JPEG (universel) */}
        <img
          src={variants.jpg}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            imageRendering: 'auto',
            ...(isSafari && {
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            })
          }}
        />
      </picture>

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};