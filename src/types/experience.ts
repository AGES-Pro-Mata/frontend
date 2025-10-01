export enum ExperienceCategory {
  TRILHA = "TRAIL",
  EVENTO = "EVENT",
  HOSPEDAGEM = "HOSTING",
  LABORATORIO = "LABORATORY"
}

export enum ExperienceCategoryCard {
  TRAIL = "TRAIL",
  EVENT = "EVENT",
  ROOM = "ROOM",
  LAB = "LAB",
}

export interface ExperienceTuningData {
  experienceId?: string;
  men: number;
  women: number;
  from: string; 
  to: string;
  savedAt: string;
}

export type TrailDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface ExperienceDTO {
  id: string;
  name: string;
  category: ExperienceCategoryCard;
  capacity: number;
  startDate?: string | null;
  endDate?: string | null;
  price?: number | null;
  weekDays?: string[] | null;
  durationMinutes?: number | null;
  trailDifficulty?: TrailDifficulty | null;
  trailLength?: number | null;
  image?: { url: string } | null;
  imageId?: string | null;
}
