import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export const ImageCarousel = ({ images, productName, className }: ImageCarouselProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Thumbnails - Mobile: horizontal scroll, Desktop: vertical */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                  selectedImage === index 
                    ? 'border-primary shadow-hero scale-105' 
                    : 'border-border hover:border-muted-foreground hover:scale-102'
                )}
              >
                <img
                  src={image}
                  alt={`${productName} vue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Desktop: vertical stack */}
          <div className="hidden lg:flex lg:flex-col gap-3 max-h-[600px] overflow-y-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105",
                  selectedImage === index 
                    ? 'border-primary shadow-hero ring-2 ring-primary/20' 
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <img
                  src={image}
                  alt={`${productName} vue ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Image */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-hero group bg-card">
            <img
              src={images[selectedImage]}
              alt={`${productName} - Image principale`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/95 backdrop-blur hover:bg-background shadow-lg"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/95 backdrop-blur hover:bg-background shadow-lg"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="p-3 bg-background/95 backdrop-blur rounded-full shadow-soft">
                <ZoomIn className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/95 backdrop-blur rounded-full text-sm font-medium shadow-soft">
                {selectedImage + 1} / {images.length}
              </div>
            )}

            {/* Progress indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      selectedImage === index 
                        ? 'bg-primary w-6' 
                        : 'bg-background/60 hover:bg-background/80'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info Card */}
        <div className="lg:col-span-3 order-3">
          <div className="sticky top-6">
            {/* This content will be filled by the parent component */}
            <div id="product-info-slot" />
          </div>
        </div>
      </div>
    </div>
  );
};