import { api } from "@/core/api";
import type { ExperienceCategory } from "@/types/experience";
import type { HttpResponse } from "@/types/http-response";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface CreateExperiencePayload {
  experienceName: string;
  experienceDescription: string;
  experienceCategory: ExperienceCategory;
  experienceCapacity: number;
  experienceImage: File;
  experienceStartDate?: Date;
  experienceEndDate?: Date;
  experiencePrice?: number;
  experienceWeekDays: string[];
  trailDurationMinutes?: number;
  trailDifficulty?: string;
  trailLength?: string;
}

export async function createExperience(payload: CreateExperiencePayload) {
  return await api.post(`/experience`, payload);
}
