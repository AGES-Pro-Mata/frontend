import { ProfessorRequestsType, RequestsType } from "@/utils/enums/requests-enum";
import i18n from "@/i18n";
import z from "zod";

const validTypes = [
  ...Object.values(RequestsType),
  ...Object.values(ProfessorRequestsType),
] as const;

type AllTypes = RequestsType | ProfessorRequestsType;
export const CreateRequestsRequest = z.object({
  type: z
    .string()
    .optional()
    .refine((val) => val === undefined || validTypes.includes(val as AllTypes), {
      message: i18n.t("requests.validation.invalidType"),
    }),
  description: z.string().optional().nullable(),
  professorId: z.string().optional().nullable(),
  reservationGroupId: z.string().optional().nullable(),
});

export type TCreateRequestsRequest = z.infer<typeof CreateRequestsRequest>;
