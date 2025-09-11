import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CarouselItem {
  src: string;
  srcWebp?: string;
  srcAvif?: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

interface CarouselSnapProps {
  items: CarouselItem[];
  peek?: string | number;
  gap?: number;
  aspectRatio?: string;
  showDots?: boolean;
  className?: string;
}

export const CarouselSnap = ({ 
  items = [], 
  peek = "10vw", 
  gap = 16, 
  aspectRatio = "16/9", 
  showDots = true,
  className 
}: CarouselSnapProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLLIElement | null)[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onScroll = () => {
      const w = vp.clientWidth;
      const i = Math.round(vp.scrollLeft / (w * 0.999)); // robust rounding
      if (i !== index) setIndex(Math.max(0, Math.min(i, items.length - 1)));
    };

    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [index, items.length]);

  const goTo = (i: number) => {
    const targetIndex = Math.max(0, Math.min(i, items.length - 1));
    slidesRef.current[targetIndex]?.scrollIntoView({ 
      behavior: "smooth", 
      inline: "start" 
    });
  };

  const peekValue = typeof peek === "number" ? `${peek}px` : peek;

  return (
    <section 
      className={cn("carousel-snap", className)} 
      role="region" 
      aria-roledescription="carousel" 
      aria-label="Carrousel produits"
      style={{
        '--gap': `${gap}px`,
        '--peek': peekValue,
        '--ratio': aspectRatio
      } as React.CSSProperties}
    >
      <style>{`
        .carousel-snap .vp { 
          overflow-x: auto; 
          -webkit-overflow-scrolling: touch; 
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .carousel-snap .vp::-webkit-scrollbar {
          display: none;
        }
        .carousel-snap .track { 
          display: grid; 
          grid-auto-flow: column; 
          grid-auto-columns: calc(100% - var(--peek)); 
          gap: var(--gap); 
          padding: 0 var(--gap); 
          margin: 0; 
          list-style: none; 
          scroll-snap-type: x mandatory; 
          scroll-padding-inline: var(--gap);
        }
        .carousel-snap .slide { 
          position: relative; 
          overflow: hidden; 
          border-radius: 16px; 
          aspect-ratio: var(--ratio); 
          scroll-snap-align: start; 
          scroll-snap-stop: always; 
          background: hsl(var(--muted));
        }
        .carousel-snap .media { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          display: block;
        }
        .carousel-snap .ui { 
          display: grid; 
          grid-template-columns: 48px 1fr 48px; 
          align-items: center; 
          gap: 12px; 
          padding: 10px 16px 0;
        }
        .carousel-snap .nav { 
          min-width: 44px; 
          min-height: 44px; 
          border-radius: 50%; 
          border: 1px solid hsl(var(--border)); 
          background: hsl(var(--background)); 
          color: hsl(var(--foreground));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.2s ease;
        }
        .carousel-snap .nav:hover {
          background: hsl(var(--muted));
        }
        .carousel-snap .nav:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .carousel-snap .fraction {
          text-align: center;
          font-size: 14px;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }
        .carousel-snap .dots { 
          display: flex; 
          gap: 8px; 
          justify-content: center; 
          padding: 8px 0 0; 
          margin: 0; 
          list-style: none;
        }
        .carousel-snap .dots button { 
          width: 8px; 
          height: 8px; 
          min-width: 24px; 
          min-height: 24px; 
          border-radius: 50%; 
          border: 0; 
          background: hsl(var(--muted-foreground) / 0.3);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .carousel-snap .dots [aria-selected="true"] { 
          background: hsl(var(--primary));
        }
        .carousel-snap .caption {
          position: absolute;
          inset: auto 0 0 0;
          padding: 12px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0));
          color: white;
        }
        @media (min-width: 1024px) { 
          .carousel-snap .track { 
            grid-auto-columns: 100%; 
          } 
        }
      `}</style>

      <div 
        className="vp" 
        ref={viewportRef} 
        tabIndex={0} 
        aria-label="Zone de balayage"
      >
        <ul className="track" aria-live="off">
          {items.map((item, i) => (
            <li 
              key={i} 
              className="slide" 
              ref={(el) => (slidesRef.current[i] = el)} 
              aria-roledescription="slide" 
              aria-label={`${i + 1} sur ${items.length}`}
            >
              <picture>
                {item.srcAvif && (
                  <source 
                    type="image/avif" 
                    srcSet={item.srcAvif} 
                    sizes="100vw" 
                  />
                )}
                {item.srcWebp && (
                  <source 
                    type="image/webp" 
                    srcSet={item.srcWebp} 
                    sizes="100vw" 
                  />
                )}
                <img 
                  className="media" 
                  src={item.src} 
                  alt={item.alt || ""} 
                  width={item.width || 1280} 
                  height={item.height || 720}
                  loading={i === 0 ? "eager" : "lazy"} 
                  decoding="async" 
                  fetchPriority={i === 0 ? "high" : "auto"} 
                />
              </picture>
              {item.title && (
                <div className="caption" aria-hidden="true">
                  <strong>{item.title}</strong>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="ui">
        <button 
          className="nav prev" 
          aria-label="Slide précédente" 
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          ‹
        </button>
        <output className="fraction" aria-live="polite">
          {index + 1} / {items.length}
        </output>
        <button 
          className="nav next" 
          aria-label="Slide suivante" 
          onClick={() => goTo(index + 1)}
          disabled={index === items.length - 1}
        >
          ›
        </button>
      </div>

      {showDots && (
        <ol className="dots" role="tablist" aria-label="Sélecteurs de slide">
          {items.map((_, i) => (
            <li key={i}>
              <button 
                role="tab" 
                aria-selected={i === index} 
                onClick={() => goTo(i)}
                aria-label={`Aller à la slide ${i + 1}`}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};