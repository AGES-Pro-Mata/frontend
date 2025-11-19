import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";
import { ExperienceCategory } from "@/types/experience";

export const ExperienceFilters = z.object({
  ...ApiDefaultFilters.shape,
  search: z.string().max(100).optional(),
  category: z.nativeEnum(ExperienceCategory),
  startDate: z.string().max(100).optional(),
  endDate: z.string().max(100).optional(),
  limit: z.number().default(12),
});

export type TExperienceFilters = z.infer<typeof ExperienceFilters>;
