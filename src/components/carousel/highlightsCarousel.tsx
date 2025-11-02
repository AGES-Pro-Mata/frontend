import { memo, useCallback, useEffect, useState } from "react";
import type { HighlightResponse } from "@/api/highlights";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CanvasCard } from "@/components/card";
import { useLoadImage } from "@/hooks/useLoadImage";

interface HighlightsCarouselProps {
  highlights: HighlightResponse[];
  className?: string;
}

const ImageLoader = memo(function ImageLoader({
  src,
  alt,
  className,
  isDecorative = false,
}: {
  src: string;
  alt: string;
  className?: string;
  isDecorative?: boolean;
}) {
  const { data: loadedUrl, isLoading } = useLoadImage(src);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={isDecorative ? "" : alt}
        aria-hidden={isDecorative ? true : undefined}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          loadedUrl && !isLoading ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
      />
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-muted"
          aria-hidden={true}
        />
      )}
    </div>
  );
});

ImageLoader.displayName = "ImageLoader";

export function HighlightsCarousel({
  highlights,
  className,
}: HighlightsCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectImage = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));
  }, [highlights.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === highlights.length - 1 ? 0 : prev + 1));
  }, [highlights.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  if (!highlights || highlights.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted p-8">
        <Typography variant="body" className="text-muted-foreground">
          Nenhum destaque disponível
        </Typography>
      </div>
    );
  }

  const selectedHighlight = highlights[selectedIndex];

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <CanvasCard className="p-6 !important bg-card/100">
        {/* Main image display */}
        <div className="relative flex w-full max-w-4xl flex-col gap-3">
          <div className="relative aspect-video w-full max-h-[400px] overflow-hidden rounded-lg bg-muted">
            <ImageLoader
              src={selectedHighlight.imageUrl}
              alt={selectedHighlight.title}
              className="h-full w-full"
            />

            {/* Navigation arrows */}
            {highlights.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Title and description */}
          <div className="flex flex-col gap-1 text-center">
            <Typography variant="h4" className="text-foreground">
              {selectedHighlight.title}
            </Typography>
            {selectedHighlight.description && (
              <Typography variant="body" className="text-muted-foreground">
                {selectedHighlight.description}
              </Typography>
            )}
          </div>
        </div>
      </CanvasCard>

      {/* Thumbnail strip */}
      {highlights.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {highlights.map((highlight, index) => (
            <button
              key={highlight.id}
              onClick={() => handleSelectImage(index)}
              className={cn(
                "relative aspect-video h-20 shrink-0 overflow-hidden rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-main-dark-green focus:ring-offset-2",
                index === selectedIndex
                  ? "ring-2 ring-main-dark-green opacity-100"
                  : "opacity-60 hover:opacity-100"
              )}
              aria-label={`Ver ${highlight.title}`}
              aria-pressed={index === selectedIndex}
            >
              <ImageLoader
                src={highlight.imageUrl}
                alt={highlight.title}
                className="h-full w-full"
                isDecorative={true}
              />
              {index === selectedIndex && (
                <div
                  className="absolute inset-0 border-2 border-main-dark-green"
                  aria-hidden={true}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
