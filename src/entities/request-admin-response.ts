import { RequestsType } from "@/utils/enums/requests-enum";
import z from "zod";

export const RequestAdminResponse = z.object({
  id: z.string(),
  experiences: z.array(z.string()).default([]),
  email: z.string().optional(),
  status: z.enum(RequestsType).optional(),
});

export type TRequestAdminResponse = z.infer<typeof RequestAdminResponse>;
