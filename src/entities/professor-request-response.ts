import { ProfessorRequestsType } from "@/utils/enums/requests-enum";
import z from "zod";

export const ProfessorRequestResponse = z.object({
  id: z.string(),
  description: z.string().optional().nullable(),
  type: z.enum(ProfessorRequestsType).optional(),
  fileUrl: z.string().optional().nullable(),
});

export type TProfessorRequestResponse = z.infer<typeof ProfessorRequestResponse>;
