type Destination = {
  src: string;
  alt: string;
};

export const DESTINATIONS: Destination[] = [
  { src: "/images/destino-01.jpg", alt: "Cabana Pró-Mata" },
  { src: "/images/destino-02.jpg", alt: "Trilha na Mata" },
  { src: "/images/destino-03.jpg", alt: "Laboratório em campo" },
  { src: "/images/destino-04.jpg", alt: "Observatório" },
  { src: "/images/destino-05.jpg", alt: "Sala de estudos" },
  { src: "/images/destino-06.jpg", alt: "Vista panorâmica" },
  { src: "/images/destino-07.jpg", alt: "Equipe em atividade" },
];

export const getDestinationByIndex = (index: number): Destination =>
  DESTINATIONS[index] ?? DESTINATIONS[0];

export const getPreviousIndex = (current: number): number =>
  current === 0 ? current : current - 1;

export const getNextIndex = (current: number): number =>
  current === DESTINATIONS.length - 1 ? current : current + 1;
