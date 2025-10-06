export enum ExperienceCategory {
  TRILHA = "trail",
  HOSPEDAGEM = "room",
  LABORATORIO = "lab",
  EVENTO = "event"
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  category: ExperienceCategory;
  capacity?: number;
  price?: number;
  startDate: string; // ou Date se o back mandar Date
  endDate?: string;   // ou Date
  trailLength?: string;
  trailDurationMinutes?: number;
}