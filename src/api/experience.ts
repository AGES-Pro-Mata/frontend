
import { api } from "@/core/api";
import axios from "axios";
import type { ExperienceCategory, Experience } from "@/types/experiences";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export interface CreateExperiencePayload {
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

export interface SearchExperienceParams {
  name?: string;
  description?: string;
  date?: string;
  sort?: "name" | "startDate" | "endDate" | "price" | "capacity";
  dir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getExperiences(
  params: SearchExperienceParams
): Promise<Experience[]> {
  const res = await axios.get<Experience[]>(`${BACKEND_URL}/experiences/search`, {
    params,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}
