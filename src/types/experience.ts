export enum ExperienceCategory {
  TRILHA = "trail",
  EVENTO = "event",
  HOSPEDAGEM = "accommodation",
  LABORATORIO = "laboratory"
}

export interface ExperienceTuningData {
  experienceId?: string;
  men: number;
  women: number;
  from: string; 
  to: string;
  savedAt: string;
}