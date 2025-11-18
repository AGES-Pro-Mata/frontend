import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";

export const ExperienceAdminRequestFilters = z.object({
  ...ApiDefaultFilters.shape,
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  date: z.iso.datetime().optional(),
  startDate: z.string().datetime().optional(), 
  endDate: z.string().datetime().optional(), 
});

export type TExperienceAdminRequestFilters = z.infer<typeof ExperienceAdminRequestFilters>;
