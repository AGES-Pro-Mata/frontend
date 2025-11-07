import { memo, useCallback, useState } from "react";

import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";
import { useLoadImage } from "@/hooks/useLoadImage";

import {
  DESTINATIONS,
  getDestinationByIndex,
  getNextIndex,
  getPreviousIndex,
} from "./destinations";

const CarouselImage = memo(function CarouselImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const { data: imageLoaded, isLoading: imageLoading } = useLoadImage(src);
  
  return (
    <div className="relative h-64 w-[28rem] max-w-full rounded-2xl overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          imageLoaded && !imageLoading ? "opacity-100" : "opacity-0",
          className
        )}
      />
      {imageLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
});

const ThumbnailImage = memo(function ThumbnailImage({ 
  src, 
  alt, 
  isActive, 
  onClick 
}: { 
  src: string; 
  alt: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  const { data: imageLoaded, isLoading: imageLoading } = useLoadImage(src);
  
  return (
    <div 
      className={cn(
        "relative h-24 w-full cursor-pointer rounded-xl overflow-hidden transition-opacity",
        isActive
          ? "opacity-100 ring-2 ring-main-dark-green"
          : "opacity-60 hover:opacity-100"
      )}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          imageLoaded && !imageLoading ? "opacity-100" : "opacity-0"
        )}
      />
      {imageLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
});

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback((nextIndex: number) => {
    setActiveIndex(nextIndex);
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveIndex((current) => getPreviousIndex(current));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((current) => getNextIndex(current));
  }, []);

  const activeDestination = getDestinationByIndex(activeIndex);

  return (
    <section
      aria-labelledby="home-carousel-title"
      className="flex w-full flex-col items-center gap-6"
    >
      <div className="text-center">
        <Typography
          id="home-carousel-title"
          variant="h3"
          className="mb-2 text-main-dark-green"
        >
          Conheça seu Destino!
        </Typography>
        <Typography variant="body" className="max-w-3xl text-muted-foreground">
          Conheça alguns dos cenários deslumbrantes que você encontrará no PRÓ-MATA
        </Typography>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center gap-4">
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            className="rounded-full border border-main-dark-green px-4 py-2 text-sm font-medium text-main-dark-green transition hover:bg-main-dark-green hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Anterior
          </button>

          <CarouselImage
            src={activeDestination.src}
            alt={activeDestination.alt}
          />

          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={handleNext}
            disabled={activeIndex === DESTINATIONS.length - 1}
            className="rounded-full border border-main-dark-green px-4 py-2 text-sm font-medium text-main-dark-green transition hover:bg-main-dark-green hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Próxima
          </button>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {DESTINATIONS.map((destination, index) => (
            <ThumbnailImage
              key={destination.src}
              src={destination.src}
              alt={destination.alt}
              isActive={index === activeIndex}
              onClick={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
