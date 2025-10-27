import { api } from "@/core/api";
import {
  type Experience,
  type ExperienceApiResponse,
  ExperienceCategory,
  type ExperienceDTO,
  mapExperienceApiResponseToDTO,
} from "@/types/experience";
import type { TApiPaginationResult } from "@/entities/api-pagination-response";

const BACKEND_URL = String(import.meta.env.VITE_BACKEND_URL);

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
  const res = await api.get<ExperienceApiResponse[]>(
    `${BACKEND_URL}/experiences/search`,
    {
      params,
    }
  );

  return res.data.map(mapExperienceApiResponseToDTO);
}

export interface FilterExperiencesParams {
  category?: ExperienceCategory;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export async function getExperiencesByFilter(
  params: FilterExperiencesParams & { page?: number; limit?: number }
): Promise<TApiPaginationResult<Experience>> {
  const res = await api.get<
    {
      items: ExperienceDTO[];
    } & { page: number; limit: number; total: number }
  >(`/experience/search`, {
    params,
  });

  return {
    items: res.data.items,
    page: res.data.page,
    limit: res.data.limit,
    total: res.data.total,
  };
}
