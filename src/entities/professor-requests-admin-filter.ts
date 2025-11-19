import z from "zod";
import { ApiDefaultFilters } from "./api-default-filters";
import { ProfessorRequestsType } from "@/utils/enums/requests-enum";

export const ProfessorRequestsAdminFilters = z.object({
  ...ApiDefaultFilters.shape,
  name: z.string().max(100).optional(),
  email: z.string().optional(),
  status: z.enum(ProfessorRequestsType).optional(),
});

export type TProfessorRequestsAdminFilters = z.infer<typeof ProfessorRequestsAdminFilters>;
