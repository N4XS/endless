import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface SwiperCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export const SwiperCarousel = ({ images, productName, className }: SwiperCarouselProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-6 w-full">
        
        {/* Main Expo Swiper */}
        <div className="w-full">
          <div className="relative group">
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={false}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30 !w-3 !h-3',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !w-4 !h-4'
              }}
              loop={true}
              className="!pb-16 expo-swiper"
              onSwiper={setSwiperInstance}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="!w-[280px] sm:!w-[320px] lg:!w-[380px]">
                  <div className="bg-gradient-to-br from-background to-muted rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-all duration-500 group/slide">
                    <div className="aspect-square w-full relative">
                      <LazyImage
                        src={image}
                        alt={`${productName} - Vue ${index + 1}`}
                        className="w-full h-full object-cover object-center transition-all duration-700 group-hover/slide:scale-110"
                      />
                      {/* Overlay gradient for better visual hierarchy */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Image counter badge */}
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-medium text-foreground">
                          {index + 1}/{images.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              onClick={() => swiperInstance?.slidePrev()}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-background/95 backdrop-blur-sm rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto" />
            </button>
            
            <button
              onClick={() => swiperInstance?.slideNext()}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-background/95 backdrop-blur-sm rounded-full border border-border shadow-soft hover:shadow-hero transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto" />
            </button>
          </div>
        </div>

        {/* Product Info Card - Responsive positioning */}
        <div className="w-full">
          <div className="max-w-md mx-auto lg:max-w-none" id="product-info-slot">
            {/* This will be populated by the parent component */}
          </div>
        </div>
      </div>

      {/* Thumbnails Navigation - Enhanced for mobile */}
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
            Galerie complète ({images.length} photos)
          </h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide p-2 justify-center">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-border hover:border-primary/70 transition-all duration-300 cursor-pointer group"
              >
                <LazyImage
                  src={image}
                  alt={`${productName} miniature ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};