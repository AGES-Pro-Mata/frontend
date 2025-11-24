import { ProfessorRequestsType } from "@/utils/enums/requests-enum";
import z from "zod";

export const ProfessorRequestAdminResponse = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(ProfessorRequestsType).optional(),
});

export type TProfessorRequestAdminResponse = z.infer<typeof ProfessorRequestAdminResponse>;
