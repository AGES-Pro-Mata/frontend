import { resolveImageUrl } from "@/utils/resolveImageUrl";
export enum ExperienceCategory {
  TRILHA = "TRAIL",
  EVENTO = "EVENT",
  HOSPEDAGEM = "HOSTING",
  LABORATORIO = "LABORATORY",
}

export enum ExperienceCategoryCard {
  TRAIL = "TRAIL",
  EVENT = "EVENT",
  ROOM = "ROOM",
  LAB = "LAB",
}

export type ExperienceWeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface ExperienceTuningData {
  experienceId?: string;
  men: number;
  women: number;
  from: string;
  to: string;
  savedAt: string;
}

export type TrailDifficulty =
  | "LIGHT"
  | "MODERATED"
  | "HEAVY"
  | "EXTREME"
  | (string & { _?: never });

type RawNumber = number | string | null | undefined;

export type ExperienceApiImage =
  | string
  | {
      url?: string | null;
    }
  | null
  | undefined;

export interface ExperienceApiResponse {
  // API GET retorna sem prefixo
  id?: string | null;
  name?: string;
  description?: string | null;
  category?: ExperienceCategory;
  capacity?: RawNumber;
  image?: ExperienceApiImage;
  startDate?: string | null;
  endDate?: string | null;
  price?: RawNumber;
  weekDays?: ExperienceWeekDay[] | null;
  durationMinutes?: RawNumber;
  trailDifficulty?: TrailDifficulty | null;
  trailLength?: RawNumber;

  // API POST/PATCH usa prefixo experience (mantido para compatibilidade)
  experienceId?: string | null;
  experienceName?: string;
  experienceDescription?: string | null;
  experienceCategory?: ExperienceCategory;
  experienceCapacity?: RawNumber;
  experienceImage?: ExperienceApiImage;
  experienceStartDate?: string | null;
  experienceEndDate?: string | null;
  experiencePrice?: RawNumber;
  experienceWeekDays?: ExperienceWeekDay[] | null;
  trailDurationMinutes?: RawNumber;
}

export interface ExperienceDTO {
  id: string;
  name: string;
  description?: string | null;
  category: ExperienceCategoryCard;
  capacity?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  price?: number | null;
  weekDays?: ExperienceWeekDay[] | null;
  durationMinutes?: number | null;
  trailDifficulty?: TrailDifficulty | null;
  trailLength?: number | null;
  image?: { url: string } | null;
  imageId?: string | null;
}

export type Experience = ExperienceDTO;

const CATEGORY_CARD_MAP: Record<ExperienceCategory, ExperienceCategoryCard> = {
  [ExperienceCategory.TRILHA]: ExperienceCategoryCard.TRAIL,
  [ExperienceCategory.EVENTO]: ExperienceCategoryCard.EVENT,
  [ExperienceCategory.HOSPEDAGEM]: ExperienceCategoryCard.ROOM,
  [ExperienceCategory.LABORATORIO]: ExperienceCategoryCard.LAB,
};

const toNumberOrNull = (value: RawNumber): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    const parsed = Number(trimmed);

    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

const mapImage = (image: ExperienceApiImage): { url: string } | null => {
  if (!image) {
    return null;
  }

  const rawUrl = typeof image === "string" ? image : image.url;

  if (!rawUrl) {
    return null;
  }

  return { url: resolveImageUrl(rawUrl) };
};

export const mapExperienceApiResponseToDTO = (
  apiExperience: ExperienceApiResponse
): Experience => {
  // Prioriza campos sem prefixo (GET) e usa prefixo como fallback (POST/PATCH)
  const rawCategory =
    apiExperience.category ?? apiExperience.experienceCategory;
  const category = rawCategory
    ? CATEGORY_CARD_MAP[rawCategory]
    : ExperienceCategoryCard.EVENT;

  const id = apiExperience.id ?? apiExperience.experienceId ?? "unknown";
  const name = apiExperience.name ?? apiExperience.experienceName ?? "";

  return {
    id,
    name,
    description:
      apiExperience.description ?? apiExperience.experienceDescription ?? null,
    category,
    capacity: toNumberOrNull(
      apiExperience.capacity ?? apiExperience.experienceCapacity
    ),
    startDate:
      apiExperience.startDate ?? apiExperience.experienceStartDate ?? null,
    endDate: apiExperience.endDate ?? apiExperience.experienceEndDate ?? null,
    price: toNumberOrNull(apiExperience.price ?? apiExperience.experiencePrice),
    weekDays:
      apiExperience.weekDays ?? apiExperience.experienceWeekDays ?? null,
    durationMinutes: toNumberOrNull(
      apiExperience.durationMinutes ?? apiExperience.trailDurationMinutes
    ),
    trailDifficulty: apiExperience.trailDifficulty ?? null,
    trailLength: toNumberOrNull(apiExperience.trailLength),
    image: mapImage(apiExperience.image ?? apiExperience.experienceImage),
    imageId: null,
  };
};
