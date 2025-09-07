import { useState } from "react";

const mockLab = "mock/mock-lab.png";
const mockQuarto = "mock/mock-quarto.png";
const mockEvento = "mock/mock-evento.png";
const mockTrilha = "mock/mock-trilha.png";

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
    <div className="flex flex-col gap-8 w-[70%] box-border h-fit my-[70px]">
      <div className="flex flex-row box-border w-full gap-6 relative justify-center ">
        {cards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            className={`flex flex-col px-[30px] opacity-70 pt-[17px] pb-[25px] bg-card transition  after:border-b-card relative w-full h-[204px] rounded-[18px] justify-between after:transition-all after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:rotate-180 after:w-[0px] after:h-[0px]  after:border-l-[20px] after:border-r-[20px] after:border-r-transparent after:border-l-transparent after:border-b-[35px]  after:bg-transparent
              ${active === i ? "opacity-100 after:content-[''] after:border-b-card after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:rotate-180 after:w-[0px] after:h-[0px]  after:border-l-[20px] after:border-r-[20px] after:border-r-transparent after:border-l-transparent after:border-b-[35px]  after:bg-transparent" : "after:opacity-0"}`}
          >
            <div>
              <h3 className="font-bold">{card.titulo}</h3>
              <p className="text-sm text-muted-foreground">{card.descricao}</p>
            </div>
            <button
              className={`${active === i ? "opacity-100" : "opacity-0"} w-[100px] h-[40px] mt-4 px-3 py-1 rounded-full bg-[#4C9613] cursor-pointer text-white text-sm`}
            >
              Ver mais
            </button>
          </div>
        ))}
      </div>

      {/* Retângulo de fotos */}
      <div className="flex flex-row gap-[10px] box-border p-[35px] bg-card rounded-[20px]">
        {cards[active].imagens.map((src, j) => (
          <div
            key={j}
            className={`flex flex-row w-full flex-1 relative h-70 overflow-hidden box-border rounded-[20px]`}
          >
            <img
              src={src}
              className="h-full w-full object-cover object-center box-border"
            />
            <div className="absolute inset-0 box-border shadow-[inset_0_0_7px_6px_rgba(0,0,0,0.3)] pointer-events-none rounded-[20px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
