import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";

export const ExperienceFilters = z.object({
  ...ApiDefaultFilters.shape,
  search: z.string().max(100).optional(),
  type: z.string().max(100).optional(),
  startDate: z.string().max(100).optional(),
  endDate: z.string().max(100).optional(),
});

export type TExperienceFilters = z.infer<typeof ExperienceFilters>;
