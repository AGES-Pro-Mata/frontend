export enum ExperienceCategory {
  TRAIL = "TRAIL",
  EVENT = "EVENT",
  ROOM = "ROOM",
  LAB = "LAB",
}

export type TrailDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface ExperienceDTO {
  id: string;
  name: string;
  category: ExperienceCategory;
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