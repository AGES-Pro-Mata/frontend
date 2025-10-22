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
  | "EASY"
  | "MEDIUM"
  | "HARD"
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
  experienceId?: string | null;
  experienceName: string;
  experienceDescription?: string | null;
  experienceCategory: ExperienceCategory;
  experienceCapacity?: RawNumber;
  experienceImage?: ExperienceApiImage;
  experienceStartDate?: string | null;
  experienceEndDate?: string | null;
  experiencePrice?: RawNumber;
  experienceWeekDays?: ExperienceWeekDay[] | null;
  trailDurationMinutes?: RawNumber;
  trailDifficulty?: TrailDifficulty | null;
  trailLength?: RawNumber;
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

  if (typeof image === "string") {
    return { url: image };
  }

  if (typeof image === "object" && image.url) {
    return { url: image.url };
  }

  return null;
};

export const mapExperienceApiResponseToDTO = (
  apiExperience: ExperienceApiResponse,
): Experience => {
  const category = CATEGORY_CARD_MAP[apiExperience.experienceCategory];

  return {
    id:
      apiExperience.experienceId ??
      `${apiExperience.experienceName}-${apiExperience.experienceCategory}`,
    name: apiExperience.experienceName,
    description: apiExperience.experienceDescription ?? null,
    category: category ?? ExperienceCategoryCard.EVENT,
    capacity: toNumberOrNull(apiExperience.experienceCapacity),
    startDate: apiExperience.experienceStartDate ?? null,
    endDate: apiExperience.experienceEndDate ?? null,
    price: toNumberOrNull(apiExperience.experiencePrice),
    weekDays: apiExperience.experienceWeekDays ?? null,
    durationMinutes: toNumberOrNull(apiExperience.trailDurationMinutes),
    trailDifficulty: apiExperience.trailDifficulty ?? null,
    trailLength: toNumberOrNull(apiExperience.trailLength),
    image: mapImage(apiExperience.experienceImage),
    imageId: null,
  };
};
