import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export const ProductGallery = ({ images, productName, className }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + images.length) % images.length);
  }, [images.length]);

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px] gap-4">
        
        {/* Main image */}
        <div className="relative group rounded-xl overflow-hidden bg-muted aspect-square">
          <LazyImage
            src={images[activeIndex]}
            alt={`${productName} - Vue ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Zoom button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            aria-label="Agrandir"
          >
            <ZoomIn className="w-5 h-5 text-foreground" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border border-border">
            <span className="text-xs font-medium text-foreground">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnails — vertical on desktop, horizontal on mobile */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[500px] scrollbar-hide pb-1 lg:pb-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 lg:w-full lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                activeIndex === index
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <LazyImage
                src={image}
                alt={`${productName} miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-2 bg-background/95 backdrop-blur-md border-border">
          <VisuallyHidden>
            <DialogTitle>{productName} - Galerie</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <LazyImage
              src={images[activeIndex]}
              alt={`${productName} - Vue ${activeIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-1.5 border border-border">
              <span className="text-sm font-medium text-foreground">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </div>
          {/* Lightbox thumbnails */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-200",
                  activeIndex === index
                    ? "border-primary"
                    : "border-border opacity-60 hover:opacity-100"
                )}
              >
                <LazyImage
                  src={image}
                  alt={`${productName} miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
