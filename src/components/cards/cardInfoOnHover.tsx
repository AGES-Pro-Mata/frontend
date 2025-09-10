import { useState } from "react";
import { Button } from "@/components/buttons/defaultButton";
import { Typography } from "@/components/typography/typography";

const mockLab = "/mock/lab.jpg";
const mockQuarto = "/mock/room.jpg";
const mockEvento = "/mock/event.jpg";
const mockTrilha = "/mock/trail-1.jpg";

const cards = [
  //Mocks Laboratórios
  {
    titulo: "Laboratórios",
    descricao:
      "Espaços equipados para pesquisas científicas e projetos acadêmicos.",
    imagens: [mockLab, mockLab, mockLab],
  },
  //Mocks Quartos
  {
    titulo: "Quartos",
    descricao: "Espaços confortáveis para hospedagem acadêmica e turística.",
    imagens: [mockQuarto, mockQuarto, mockQuarto],
  },
  //Mocks Eventos
  {
    titulo: "Eventos",
    descricao: "Estrutura para palestras, seminários e congressos.",
    imagens: [mockEvento, mockEvento, mockEvento],
  },
  //Mocks Trilhas
  {
    titulo: "Trilhas",
    descricao: "Caminhos ecológicos para exploração e aprendizado.",
    imagens: [mockTrilha, mockTrilha, mockTrilha],
  },
];

export function CardsInfoOnHover() {
  const [active, setActive] = useState(0); // primeiro card ativo por padrão

  return (
    <div className="flex flex-col gap-[clamp(1rem,3vw,2rem)] w-full max-w-[clamp(60rem,90vw,72rem)] box-border h-fit my-[clamp(2.5rem,6vw,4.375rem)] mx-auto px-4 sm:px-0">
      {/* Desktop cards (hover) */}
      <div className="hidden sm:flex flex-row box-border w-full gap-[clamp(1rem,2.5vw,1.5rem)] relative justify-center ">
        {cards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            className={`flex flex-col px-[clamp(1.25rem,3vw,1.875rem)] opacity-70 pt-[clamp(0.75rem,2vw,1.0625rem)] pb-[clamp(1rem,3vw,1.5625rem)] bg-card transition after:border-b-card relative w-full h-[clamp(10rem,32vw,12.75rem)] rounded-[clamp(0.75rem,2vw,1.125rem)] justify-between after:transition-all after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:rotate-180 after:w-[0px] after:h-[0px] after:border-l-[clamp(0.75rem,2.5vw,1.25rem)] after:border-r-[clamp(0.75rem,2.5vw,1.25rem)] after:border-r-transparent after:border-l-transparent after:border-b-[clamp(1.25rem,4vw,2.1875rem)] after:bg-transparent
              ${active === i ? "opacity-100 after:content-[''] after:border-b-card after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:rotate-180 after:w-[0px] after:h-[0px] after:border-l-[clamp(0.75rem,2.5vw,1.25rem)] after:border-r-[clamp(0.75rem,2.5vw,1.25rem)] after:border-r-transparent after:border-l-transparent after:border-b-[clamp(1.25rem,4vw,2.1875rem)] after:bg-transparent" : "after:opacity-0"}`}
          >
            <div className="flex flex-col gap-[clamp(0.375rem,1.5vw,0.5rem)]">
              <Typography variant="h5" className="text-black">
                {card.titulo}
              </Typography>
              <Typography className="text-sm text-muted-foreground">
                {card.descricao}
              </Typography>
            </div>
            <Button
              label="Ver mais"
              className={`${active === i ? "opacity-100" : "opacity-0"} w-[clamp(5.5rem,18vw,6.25rem)] h-[clamp(2.25rem,6vh,2.5rem)] mt-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.625rem,2.2vw,0.75rem)] py-[clamp(0.25rem,1.2vw,0.375rem)] rounded-full bg-[#4C9613] cursor-pointer text-white text-sm`}
            />
          </div>
        ))}
      </div>

      {/* Mobile: pill nav + active content */}
      <div className="sm:hidden flex flex-col w-full">
        <div className="-mx-4 px-4 flex gap-[clamp(0.5rem,3vw,0.75rem)] overflow-x-auto snap-x snap-mandatory pb-2">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 snap-start rounded-full border px-3 py-2 text-sm font-semibold transition-colors
                ${active === i ? "bg-selected-banner text-main-dark-green border-transparent" : "bg-transparent text-on-banner-text border-banner"}`}
            >
              {card.titulo}
            </button>
          ))}
        </div>

        <div className="mt-2">
          <Typography variant="h5" className="text-black">
            {cards[active].titulo}
          </Typography>
          <Typography className="text-sm text-muted-foreground mt-1">
            {cards[active].descricao}
          </Typography>
          <Button
            label="Ver mais"
            className="mt-3 w-[clamp(7rem,50vw,9rem)] h-[clamp(2.25rem,6vh,2.5rem)] rounded-full bg-[#4C9613] text-white text-sm"
          />
        </div>
      </div>

      {/* Retângulo de fotos */}
      <div className=" flex flex-row gap-[clamp(0.5rem,2vw,0.625rem)] sm:[--gap:clamp(0.5rem,2vw,0.625rem)] sm:gap-[var(--gap)] box-border p-[clamp(0.75rem,3vw,1rem)] sm:py-[clamp(2rem,5vw,2.75rem)] sm:px-[var(--gap)] bg-card rounded-[clamp(0.75rem,2vw,1.25rem)] overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:mx-[clamp(0.75rem,3vw,1.5rem)]">
        {cards[active].imagens.map((src, j) => (
          <div
            key={j}
            className={`flex flex-row w-[calc(100%_-_0.75rem)] sm:w-full sm:flex-1 shrink-0 relative aspect-[3/2] sm:aspect-auto sm:h-[clamp(12rem,28vw,17.5rem)] overflow-hidden box-border rounded-[clamp(0.75rem,2vw,1.25rem)] snap-center`}
          >
            <img
              src={src}
              className="h-full w-full object-cover object-center box-border rounded-[clamp(0.75rem,2vw,1.25rem)]"
              style={{ borderRadius: "clamp(0.75rem,2vw,1.25rem)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
