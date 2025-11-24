import { ProfessorRequestsType, RequestsType } from "@/utils/enums/requests-enum";
import z from "zod";

const validTypes = [
  ...Object.values(RequestsType),
  ...Object.values(ProfessorRequestsType),
] as const;

type AllTypes = RequestsType | ProfessorRequestsType;
//TODO: traduzir com i18n
export const CreateRequestsRequest = z.object({
  type: z
    .string()
    .optional()
    .refine((val) => val === undefined || validTypes.includes(val as AllTypes), {
      message: "Tipo de solicitação inválido.",
    }),
  description: z.string().optional().nullable(),
  professorId: z.string().optional().nullable(),
  reservationGroupId: z.string().optional().nullable(),
});

export type TCreateRequestsRequest = z.infer<typeof CreateRequestsRequest>;
