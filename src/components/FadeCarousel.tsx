import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';

interface FadeCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export const FadeCarousel = ({ images, productName, className }: FadeCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const handleManualNav = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10s of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Image with Fade */}
        <div className="lg:col-span-9">
          <div className="relative w-full rounded-2xl overflow-hidden bg-muted group">
            <div className="aspect-[16/10] w-full relative">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-in-out",
                    index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <img
                    src={image}
                    alt={`${productName} - Vue ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}

              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent z-20 pointer-events-none" />

              {/* Navigation arrows */}
              <button
                onClick={() => { prev(); handleManualNav((current - 1 + images.length) % images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-background/80 border border-border/50 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-105"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => { next(); handleManualNav((current + 1) % images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-background/80 border border-border/50 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-105"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualNav(index)}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      index === current
                        ? "w-8 h-2 bg-white"
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                    )}
                    aria-label={`Voir image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails strip */}
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleManualNav(index)}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300",
                  index === current
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={image}
                  alt={`${productName} miniature ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Slot */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-8" id="product-info-slot">
            {/* Populated by parent */}
          </div>
        </div>
      </div>
    </div>
  );
};
