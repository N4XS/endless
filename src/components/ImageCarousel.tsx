import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
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
      <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Thumbnails - Vertical on large screens */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide p-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 lg:w-full lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                  selectedImage === index 
                    ? "border-primary shadow-hero" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={image}
                  alt={`${productName} vue ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative group bg-muted rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-shadow duration-300">
            <div className="aspect-square">
              <img
                src={images[selectedImage]}
                alt={`${productName} - Vue ${selectedImage + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/95 backdrop-blur rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-primary mx-auto" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/95 backdrop-blur rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-primary mx-auto" />
            </button>

            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur rounded-full p-3 shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="w-5 h-5 text-primary" />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur rounded-full px-4 py-2 shadow-soft">
              <span className="text-sm font-medium text-foreground">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>

        {/* Product Info Slot - Sticky on large screens */}
        <div className="lg:col-span-3 order-3">
          <div className="lg:sticky lg:top-8" id="product-info-slot">
            {/* This will be populated by the parent component */}
          </div>
        </div>
      </div>
    </div>
  );
};