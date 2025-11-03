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
  const formData = new FormData();
  
  formData.append('experienceName', payload.experienceName);
  formData.append('experienceDescription', payload.experienceDescription);
  formData.append('experienceCategory', payload.experienceCategory);
  formData.append('experienceCapacity', payload.experienceCapacity.toString());
  formData.append('image', payload.experienceImage);
  
  if (payload.experienceStartDate) {
    formData.append('experienceStartDate', payload.experienceStartDate.toISOString());
  }
  
  if (payload.experienceEndDate) {
    formData.append('experienceEndDate', payload.experienceEndDate.toISOString());
  }
  
  if (payload.experiencePrice !== undefined) {
    formData.append('experiencePrice', payload.experiencePrice.toString());
  }
  
  if (payload.experienceWeekDays && payload.experienceWeekDays.length > 0) {
    payload.experienceWeekDays.forEach((day) => {
      formData.append('experienceWeekDays', day);
    });
  }
  
  if (payload.trailDurationMinutes !== undefined) {
    formData.append('trailDurationMinutes', payload.trailDurationMinutes.toString());
  }
  
  if (payload.trailDifficulty) {
    formData.append('trailDifficulty', payload.trailDifficulty);
  }
  
  if (payload.trailLength) {
    formData.append('trailLength', payload.trailLength);
  }

  return await api.post('/experience', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export async function getExperienceById(experienceId: string): Promise<Experience> {
  const res = await api.get<ExperienceApiResponse>(`/experience/${experienceId}`);
  return mapExperienceApiResponseToDTO(res.data);
}

export interface UpdateExperiencePayload {
  experienceName: string;
  experienceDescription: string;
  experienceCategory: ExperienceCategory;
  experienceCapacity: string;
  experienceImage?: File | string;
  experienceStartDate?: Date | string;
  experienceEndDate?: Date | string;
  experiencePrice: string;
  experienceWeekDays: string[];
  trailDurationMinutes?: string;
  trailDifficulty?: string;
  trailLength?: string;
}

export async function updateExperience(experienceId: string, payload: UpdateExperiencePayload) {
  const formData = new FormData();
  
  formData.append('experienceName', payload.experienceName);
  formData.append('experienceDescription', payload.experienceDescription);
  formData.append('experienceCategory', payload.experienceCategory);
  formData.append('experienceCapacity', payload.experienceCapacity);
  formData.append('experiencePrice', payload.experiencePrice);
  
  if (payload.experienceImage instanceof File) {
    formData.append('image', payload.experienceImage);
  }
  
  if (payload.experienceStartDate) {
    const startDate = payload.experienceStartDate instanceof Date 
      ? payload.experienceStartDate.toISOString() 
      : payload.experienceStartDate;
    formData.append('experienceStartDate', startDate);
  }
  
  if (payload.experienceEndDate) {
    const endDate = payload.experienceEndDate instanceof Date 
      ? payload.experienceEndDate.toISOString() 
      : payload.experienceEndDate;
    formData.append('experienceEndDate', endDate);
  }
  
  if (payload.experienceWeekDays && payload.experienceWeekDays.length > 0) {
    payload.experienceWeekDays.forEach((day) => {
      formData.append('experienceWeekDays', day);
    });
  }
  
  if (payload.trailDurationMinutes) {
    formData.append('trailDurationMinutes', payload.trailDurationMinutes);
  }
  
  if (payload.trailDifficulty) {
    formData.append('trailDifficulty', payload.trailDifficulty);
  }
  
  if (payload.trailLength) {
    formData.append('trailLength', payload.trailLength);
  }

  return await api.patch(`/experience/${experienceId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function deleteExperience(experienceId: string) {
  return await api.delete(`/experience/${experienceId}`);
}

export async function toggleExperienceStatus(experienceId: string, active: boolean) {
  return await api.patch(`/experience/${experienceId}/status/${active}`);
}
