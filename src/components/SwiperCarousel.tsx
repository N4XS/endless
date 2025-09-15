import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface SwiperCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export const SwiperCarousel = ({ images, productName, className }: SwiperCarouselProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 w-full">
        
        {/* Main Swiper - Triple Slider */}
        <div className="lg:col-span-9 order-1 w-full">
          <div className="relative group">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/50',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary'
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="!pb-12"
              onBeforeInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore  
                swiper.params.navigation.nextEl = nextRef.current;
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-muted rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-shadow duration-300">
                    <div className="aspect-square w-full">
                      <LazyImage
                        src={image}
                        alt={`${productName} - Vue ${index + 1}`}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              ref={prevRef}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/95 rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              <ChevronLeft className="w-6 h-6 text-primary mx-auto" />
            </button>
            
            <button
              ref={nextRef}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/95 rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              <ChevronRight className="w-6 h-6 text-primary mx-auto" />
            </button>
          </div>
        </div>

        {/* Product Info Slot - Sticky on large screens */}
        <div className="lg:col-span-3 order-2 w-full">
          <div className="lg:sticky lg:top-8 w-full" id="product-info-slot">
            {/* This will be populated by the parent component */}
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="mt-6 w-full">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1">
          {images.slice(0, 8).map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-colors duration-300"
            >
              <LazyImage
                src={image}
                alt={`${productName} miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {images.length > 8 && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted border-2 border-border flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{images.length - 8}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};