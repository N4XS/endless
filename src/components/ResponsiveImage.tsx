import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcWebp?: string;
  srcAvif?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const ResponsiveImage = ({ 
  src, 
  alt, 
  className = "media-cover", 
  width = 1280, 
  height = 720,
  loading = 'lazy',
  sizes = "100vw",
  srcWebp,
  srcAvif,
  fetchPriority = 'auto'
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <picture>
        {srcAvif && (
          <source 
            type="image/avif" 
            srcSet={srcAvif} 
            sizes={sizes} 
          />
        )}
        {srcWebp && (
          <source 
            type="image/webp" 
            srcSet={srcWebp} 
            sizes={sizes} 
          />
        )}
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          className={cn(
            "transition-opacity duration-300 w-full h-full object-cover",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </picture>
      {isError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};