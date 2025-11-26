import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";
import { ExperienceCategory } from "@/types/experience";

export const ExperienceAdminRequestFilters = z.object({
  ...ApiDefaultFilters.shape,
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  category: z.array(z.enum(ExperienceCategory)).optional(),
  date: z.iso.datetime().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type TExperienceAdminRequestFilters = z.infer<typeof ExperienceAdminRequestFilters>;
