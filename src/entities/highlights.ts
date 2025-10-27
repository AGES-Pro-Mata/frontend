export enum HighlightCategory {
  LABORATORIO = "LABORATORY",
  QUARTO = "HOSTING",
  EVENTO = "EVENT",
  TRILHA = "TRAIL",
  CARROSSEL = "CAROUSEL",
}

export type Highlight = {
  id: string;
  category: HighlightCategory;
  imageUrl: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type HighlightFormData = {
  category: HighlightCategory;
  image: File;
  title: string;
  description?: string;
  order: number;
};
