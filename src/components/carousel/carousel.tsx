import { useCallback, useState } from "react";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";

type Destination = {
  src: string;
  alt: string;
};

const DESTINATIONS: Destination[] = [
  { src: "/images/destino-01.jpg", alt: "Cabana Pró-Mata" },
  { src: "/images/destino-02.jpg", alt: "Trilha na Mata" },
  { src: "/images/destino-03.jpg", alt: "Laboratório em campo" },
  { src: "/images/destino-04.jpg", alt: "Observatório" },
  { src: "/images/destino-05.jpg", alt: "Sala de estudos" },
  { src: "/images/destino-06.jpg", alt: "Vista panorâmica" },
  { src: "/images/destino-07.jpg", alt: "Equipe em atividade" },
];

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback((nextIndex: number) => {
    setActiveIndex(nextIndex);
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? current : current - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((current) =>
      current === DESTINATIONS.length - 1 ? current : current + 1
    );
  }, []);

  const activeDestination = DESTINATIONS[activeIndex] ?? DESTINATIONS[0];

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

          <img
            src={activeDestination.src}
            alt={activeDestination.alt}
            className="h-64 w-[28rem] max-w-full rounded-2xl object-cover"
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
            <img
              key={destination.src}
              src={destination.src}
              alt={destination.alt}
              onClick={() => handleSelect(index)}
              className={cn(
                "h-24 w-full cursor-pointer rounded-xl object-cover transition-opacity",
                index === activeIndex
                  ? "opacity-100 ring-2 ring-main-dark-green"
                  : "opacity-60 hover:opacity-100"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
